import { useEffect } from "react";
import { GridCustom } from "../../../components/grid/Grid";
import { format, parseISO } from "date-fns";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  getSystemComment,
  getSystemCommentAdmin,
} from "../../../services/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import MainContainer from "../../../components/mainContainer";
import { ADMIN_ROL } from "../../../utils/constants";

type ListSystemCommentsProps = {
  /** id de sistema, para cargar todos sus comentarios. */
  id?: number;
};

const ListSystemComments: React.FC<ListSystemCommentsProps> = ({ id }) => {
  const { idParm } = useParams();
  const comments = useSelector((state: RootState) => state.comments);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const headers = [
    { name: "Usuario", value: "userName" },
    { name: "Fecha", value: "date" },
    { name: "Comentario", value: "comment" },
  ];

  async function fetchData() {
    let response: any;
    if (userRole === ADMIN_ROL) {
      response = await getSystemCommentAdmin(Number(idParm));
    } else {
      response = await getSystemComment(Number(idParm));
    }

    console.log(response);
    if (response?.data.error || response === undefined) {
    } else {
      dispatch({ type: "SET_COMMENTS", payload: response?.data });
    }
  }

  useEffect(() => {
    console.log(idParm);

    if (idParm === undefined) {
      if (!comments) {
        const formatedComments = comments?.map((comment: { date: string }) => {
          const parsedDate = parseISO(comment.date);
          comment.date = format(new Date(parsedDate), "dd/MM/yyyy");
        });
        dispatch({ type: "SET_COMMENTS", payload: formatedComments });
      }
    } else {
      fetchData();
    }
  }, [idParm, dispatch]);

  const openAllComments = () => {
    navigator(`/system/${id}/comments`);
  };

  const userRole = localStorage.getItem("userRole");

  const handleReturn = () => {
    navigator(`/system/${idParm}/view`);
  };

  const colorExplanation = (
    <div className="color-explanation mb-3">
      <Typography>Pendiente</Typography>
      <div className="alternative-optimal-standard"></div>
    </div>
  );

  return (
    <>
      {idParm ? (
        <MainContainer cardTitle="Comentarios">
          {userRole === ADMIN_ROL && colorExplanation}
          <GridCustom
            header={headers}
            body={comments}
            hasEdit={userRole === ADMIN_ROL}
            hasStatus={userRole === ADMIN_ROL}
            navigateTo="comment"
          />
          <div className="card-footer text-body-secondary align-right">
            <Button onClick={handleReturn} variant="contained">
              Volver
            </Button>
          </div>
        </MainContainer>
      ) : (
        <>
          <GridCustom header={headers} body={comments} navigateTo="comment" />
          {(comments.length >= 5 || userRole === ADMIN_ROL) && <Button variant="text" color="success" onClick={openAllComments}>
            Ver más...
          </Button>}
        </>
      )}
    </>
  );
};

export default ListSystemComments;
