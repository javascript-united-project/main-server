import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Tooltip } from "@mui/material";

import { RecordContext } from "../context/RecordContext";
import "./QuizList.css";
import "../styles/style.css";
import { ProceedType, EndType } from "../utils/type";

const checkProgress = (iterate, action) =>
  iterate.some((each) => each === null)
    ? new ProceedType()[action]
    : iterate
    ? new EndType()[action]
    : "";

const QuizItem = ({ chapterId }) => {
  const { record } = useContext(RecordContext);

  return (
    <Grid className="item-grid">
      <Tooltip
        title={
          record && record[chapterId]
            ? checkProgress(record[chapterId], "toString")
            : ""
        }
        followCursor
      >
        <Paper
          className={
            record && record[chapterId]
              ? `item-paper ${checkProgress(record[chapterId], "cssClassName")}`
              : "item-paper"
          }
        >
          <Link to={`/quiz/${chapterId}`}>챕터{chapterId.split("_")[1]}</Link>
        </Paper>
      </Tooltip>
    </Grid>
  );
};

export default QuizItem;
