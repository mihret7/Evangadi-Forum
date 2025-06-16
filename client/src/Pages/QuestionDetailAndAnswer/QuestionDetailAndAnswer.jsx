import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function QuestionDetailAndAnswer() {
  const { userData, setUserData } = useContext(UserContext);
  const token = userData?.token;
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState({
    user_id: userData?.userid,
    question_id,
    answer: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    getAnswerError: null,
    getQuestionDetailError: null,
    postAnswerError: null,
  });

  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [answerPage, setAnswerPage] = useState(1);
  const [answerPageSize] = useState(10);
  const [answerPagination, setAnswerPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [questionDetail, setQuestionDetail] = useState(null);
  const [successAnswer, setSuccessAnswer] = useState(false);
  const [answerSort, setAnswerSort] = useState("recent");

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please log in to post your answer", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!answer.answer.trim()) {
      toast.error("Please write your answer before posting", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    setError({
      ...error,
      postAnswerError: null,
    });

    axios
      .post("/answer", answer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
        getAllAnswers();
        setSuccessAnswer(true);
        setAnswer({ ...answer, answer: "" });
        toast.success("Answer Posted Successfully");
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError((prev) => ({ ...prev, postAnswerError: errorMessage }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Vote handler
  const handleVote = async (type, id, action) => {
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await axios.post(`/${type}s/${id}/${action}`);
      const { likes, dislikes } = res.data;

      if (type === "question") {
        setQuestionDetail((prev) => ({ ...prev, likes, dislikes }));
      } else if (type === "answer") {
        setAllQuestionAnswers((prevAnswers) =>
          prevAnswers.map((ans) =>
            ans.answer_id === id ? { ...ans, likes, dislikes } : ans
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${action} ${type}`, err);
      toast.error(`Failed to ${action} ${type}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleChange = (e) => {
    setSuccessAnswer(false);
    const { name, value } = e.target;
    setAnswer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAllAnswers = () => {
    setLoading(true);
    setError({
      ...error,
      getAnswerError: null,
    });
    axios
      .get(
        `/answer/${question_id}?page=${answerPage}&pageSize=${answerPageSize}&sort=${answerSort}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (Array.isArray(res.data.answers)) {
          setAllQuestionAnswers(res.data.answers);
          setAnswerPagination(
            res.data.pagination || {
              total: 0,
              page: 1,
              pageSize: 5,
              totalPages: 1,
            }
          );
        } else {
          setAllQuestionAnswers([]);
          setAnswerPagination({
            total: 0,
            page: 1,
            pageSize: 5,
            totalPages: 1,
          });
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError((prev) => ({ ...prev, getAnswerError: errorMessage }));
        setAllQuestionAnswers([]);
        setAnswerPagination({ total: 0, page: 1, pageSize: 5, totalPages: 1 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getQuestionDetail = () => {
    setLoading(true);
    setError({
      ...error,
      getQuestionDetailError: null,
    });
    axios
      .get(`/question/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setQuestionDetail(res.data.question);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        console.log(errorMessage);
        setError((prev) => ({ ...prev, getQuestionDetailError: errorMessage }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load question detail and answers when component mounts
  useEffect(() => {
    getQuestionDetail();
    getAllAnswers();
  }, [question_id, successAnswer, answerPage, answerPageSize, answerSort]);
  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.theQuestion}>
          <h3 className={styles.title}>Question</h3>
          {questionDetail ? (
            <>
              <p className={styles.Qtitle}>{questionDetail.question_title}</p>
              <p>{questionDetail.question_description}</p>
              {/* voteButtons  */}
              <VoteButtons
                likes={questionDetail.likes}
                dislikes={questionDetail.dislikes}
                userVote={questionDetail.user_vote_type}
                onVote={(action) =>
                  handleVote("question", questionDetail.question_id, action)
                }
              />
            </>
          ) : (
            <p>Question not found.</p>
          )}
        </div>

        <div className={styles.community_answer}>
          <hr />
          {/* Answers title and sort filter in a flex row */}
          <div className={styles.questions_sort_row}>
            <h2 className={styles.title}>Answers From the Community</h2>
            <div className={styles.sort_container}>
              <label htmlFor="answer-sort-select" className={styles.sort_label}>
                Sort by:
              </label>
              <select
                id="answer-sort-select"
                className={styles.sort_select}
                value={answerSort}
                onChange={(e) => {
                  setAnswerSort(e.target.value);
                  setAnswerPage(1);
                }}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          <hr />
          <div className={styles.answers_container}>
            {error.getAnswerError ? (
              <p>{error?.getAnswerError}</p>
            ) : answersForQuestion.length === 0 ? (
              <p>No answers yet. Be the first to answer!</p>
            ) : (
              <>
                {answersForQuestion.map((answerItem) => (
                  <div
                    key={answerItem.answer_id}
                    className={styles.question_item_wrapper}
                  >
                    <div className={styles.user_container}>
                      <div className={styles.user_question}>
                        <div className={styles.usericon_and_username}>
                          <div className={styles.inner_center}>
                            <FaUserCircle
                              size={80}
                              className={styles.usericon}
                              style={{
                                background: "var(--white)",
                                color: "#1e3a5f",
                                borderRadius: "50%",
                                padding: "5px",
                              }}
                            />
                            <span>{answerItem.user_name}</span>
                          </div>
                        </div>
                        <div>
                          <div className={styles.Qbox}>
                            <p className={styles.Qtitle}>{answerItem.answer}</p>
                            <p className={styles.timestamp_title}>
                              {getTimeDifference(answerItem.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.vote_section}>
                        <VoteButtons
                          likes={answerItem.likes}
                          dislikes={answerItem.dislikes}
                          userVote={answerItem.user_vote_type}
                          onVote={(action) =>
                            handleVote("answer", answerItem.answer_id, action)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Pagination Controls for Answers */}
                <div className={styles.pagination_container}>
                  <button
                    className={styles.pagination_btn}
                    onClick={() => setAnswerPage((p) => Math.max(1, p - 1))}
                    disabled={answerPage === 1}
                  >
                    Previous
                  </button>
                  <span className={styles.pagination_info}>
                    Page {answerPagination.page} of{" "}
                    {answerPagination.totalPages}
                  </span>
                  <button
                    className={styles.pagination_btn}
                    onClick={() =>
                      setAnswerPage((p) =>
                        Math.min(answerPagination.totalPages, p + 1)
                      )
                    }
                    disabled={answerPage === answerPagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.answer__box}>
          <h3 className={styles.title}>Answer the Top Question</h3>
          <Link to="/home">Go to Question page</Link>
          <form onSubmit={handleSubmitAnswer} className={styles.answerform}>
            <textarea
              name="answer"
              id="answer"
              placeholder="Your answer here"
              onChange={handleChange}
              value={answer.answer}
              required
            ></textarea>
            {error?.postAnswerError && (
              <p className={styles.error}>{error.postAnswerError}</p>
            )}
            <button
              type="submit"
              className={styles.answerBtn}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post your Answer"}
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
