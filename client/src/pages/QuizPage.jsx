import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
} from "react";
import { useParams, Prompt, Link } from "react-router-dom";
import axios from "axios";

import { Button, Checkbox, Paper } from "@mui/material";

import { QuizContext } from "../context/QuizContext";
import { AuthContext } from "../context/AuthContext";
import "./QuizPage.css";

let CANDIDATE = ["answer", "wrong_1", "wrong_2", "wrong_3"];

const fisherYatesShuffle = (arr) => {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [...arr];
};

const QuizPage = memo((_) => {
  const { chapterId } = useParams();
  const { quizTitle, setQuizTitle } = useContext(QuizContext);
  const { record } = useContext(AuthContext);

  const [quizInstruction, setQuizInstruction] = useState("");
  const [quizNum, setQuizNum] = useState(0);
  const [quizTable, setQuizTable] = useState({});
  const [shuffleAnswerKeys, setShuffleAnswerKeys] = useState({});
  const [shuffleAnswerUI, setShuffleAnswerUI] = useState([]);

  const [selectedValue, setSelectedValue] = useState("");
  const [isNotSubmit, setIsNotSubmit] = useState(true);
  const isFirstRender = useRef(true);

  // Need Map use size
  const quizLength = Object.keys(quizTable).length;
  const minMove = quizNum === 0;
  const maxMove = quizNum + 1 === quizLength;

  useMemo(
    (_) => {
      setShuffleAnswerKeys((_) => {
        let result = {};
        for (let index = 0; index < quizLength; index++) {
          result[index] = fisherYatesShuffle(CANDIDATE);
        }
        return { ...result };
      });
    },
    [quizLength]
  );
  useMemo(
    (_) => {
      axios
        .get(`/quiz/v2/content/${chapterId}`)
        .then(({ data }) => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          setQuizTable({ ...data.data.hits });
          setQuizTitle(data.data.hits[0]["_source"]["subject_category"]);
        })
        .catch((err) => console.log(err.message));
    },
    [chapterId, setQuizTitle]
  );
  useEffect(
    (_) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (quizTable[quizNum]["cache"])
        setSelectedValue(quizTable[quizNum]["cache"]);
      else if (record[chapterId][quizNum])
        setSelectedValue(
          shuffleAnswerKeys[quizNum].findIndex(
            (element) => element === "answer"
          )
        );

      setQuizInstruction(quizTable[quizNum]["_source"]["instruction"]);
      setShuffleAnswerUI([
        ...shuffleAnswerKeys[quizNum].map((value, index) => {
          return (
            <div key={index}>
              {/* 체크해제 가능한가 */}
              <Checkbox
                checked={selectedValue === index}
                value={index}
                onChange={(e) => {
                  setSelectedValue(parseInt(e.target.value));
                }}
              />
              {quizTable[quizNum]["_source"][value]}
            </div>
          );
        }),
      ]);
    },
    [quizTable, quizNum, shuffleAnswerKeys, selectedValue, record, chapterId]
  );
  useEffect(
    (_) => {
      if (maxMove) setIsNotSubmit(false);
      else setIsNotSubmit(true);
    },
    [maxMove]
  );

  const movePrevious = (_) => {
    setQuizNum((quizNum) => quizNum - 1);
    quizTable[quizNum]["cache"] = selectedValue;

    setSelectedValue("");
  };
  const enterAnswerSheet = (answer, sheet) => {
    if (answer === "answer") sheet = true;
    else if (!selectedValue) sheet = null;
    else sheet = false;
  };
  const moveNext = (_) => {
    setQuizNum((quizNum) => quizNum + 1);
    quizTable[quizNum]["cache"] = selectedValue;

    enterAnswerSheet(
      shuffleAnswerKeys[quizNum][selectedValue],
      quizTable[quizNum]["correct"]
    );
    setSelectedValue("");
  };
  const makeSubmitableSheet = (sheetRecord) => {
    const sheetData = sheetRecord.map((each) => each["correct"]);
    const result = { sheet: {} };
    result["sheet"][`${chapterId}`] = sheetData;
    return result;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    quizTable[quizNum]["cache"] = selectedValue;

    enterAnswerSheet(
      shuffleAnswerKeys[quizNum][selectedValue],
      quizTable[quizNum]["correct"]
    );

    await axios({
      url: `/user/record/${chapterId}`,
      method: "patch",
      data: makeSubmitableSheet(Object.values(quizTable)),
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isNotSubmit) {
    window.onbeforeunload = () => true;
  } else {
    window.onbeforeunload = undefined;
  }
  return (
    <>
      <Prompt
        when={isNotSubmit}
        message="퀴즈를 제출 하지 않았습니다. 그래도 나가시겠습니까?"
      />
      <div className="header-container">
        <h2 className="header-title">
          {quizTitle} (챕터 {chapterId.charAt(chapterId.length - 1)})
        </h2>
        <span>
          Question # {quizNum + 1} / {Object.keys(quizTable).length}
        </span>
      </div>
      {/* Paper에 패딩값 필요 */}
      <Paper elevation={4}>
        <h3>{quizInstruction}</h3>

        {shuffleAnswerUI}
        <div className="button-container">
          <Button
            variant="outlined"
            color="primary"
            className="btn-left"
            disabled={minMove && true}
            onClick={movePrevious}
          >
            Previous
          </Button>
          {maxMove ? (
            <Button variant="contained" color="secondary" onSubmit={onSubmit}>
              <Link to={`/quiz/chart/${chapterId}`}>Submit</Link>
            </Button>
          ) : (
            <Button variant="outlined" color="primary" onClick={moveNext}>
              Next
            </Button>
          )}
        </div>
      </Paper>
    </>
  );
});

export default QuizPage;
