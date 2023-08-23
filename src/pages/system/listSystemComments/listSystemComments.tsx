import { useEffect, useState } from "react";
import { GridCustom } from "../../../components/grid/Grid";
import { format, parseISO } from "date-fns";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getSystemComment } from "../../../services/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import MainContainer from "../../../components/mainContainer";

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
    const response = await getSystemComment(Number(idParm));

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

  return (
    <>
      {idParm ? (
        <MainContainer cardTitle="Comentarios">
          <GridCustom header={headers} body={comments} />
        </MainContainer>
      ) : (
        <>
          <GridCustom header={headers} body={comments} />
          <Button variant="text" color="success" onClick={openAllComments}>
            Ver más...
          </Button>
        </>
      )}
    </>
  );
};

export default ListSystemComments;
