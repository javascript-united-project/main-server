import React, { useState, useContext } from "react";
import axios from "axios";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import { Box, Typography, Modal } from "@mui/material";

import { RecordContext } from "../context/RecordContext";
import chatImg from "../image/ul-comment-message.png";
import rankImg from "../image/ranking.png";
import "./QuizList.css";
import { chatAppDomain as CHAT_APP_DOMAIN } from "../../package.json";
import { SUBJECT_CODE_RECORDS } from "../utils/quiz";
import QuizItem from "./QuizItem";

const QuizMenu = (chapters) =>
  chapters.map(({ key }) => <QuizItem key={key} chapterId={key} />);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const { name } = useContext(RecordContext);
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;
  const [open, setOpen] = useState(false);
  const [rankData, setRankData] = useState([]);

  const handleOpen = async () => {
    await axios
      .get(`/score/aggregate/all/rank/${SUBJECT_CODE_RECORDS[quizInfo.key]}`)
      .then(({ data }) => {
        setRankData(data);
        setOpen(true);
      })
      .catch((err) => console.error(err));
  };
  const handleClose = () => setOpen(false);

  const RankList = () => {
    return (
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          💯💯순위💯💯
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {rankData.data.map((ranking, i) => (
            <p>
              {i + 1}등 : {ranking.name}
            </p>
          ))}
        </Typography>
      </Box>
    );
  };
  return (
    <>
      <div className="quiz-list-container">
        <h3>{quizInfo.key}</h3>

        <img className="chat-img" src={rankImg} onClick={handleOpen} alt="" />
        <Modal open={open} onClose={handleClose}>
          <RankList />
        </Modal>

        <a
          href={`${CHAT_APP_DOMAIN}/?name=${name}&room=${
            SUBJECT_CODE_RECORDS[quizInfo.key]
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <img className="chat-img" src={chatImg} alt="" />
        </a>
      </div>

      <ScrollMenu>{QuizMenu(chapters)}</ScrollMenu>
    </>
  );
};

export default QuizList;
