import { useState } from "react";
import ReplyForm from "../components/UI/forms/reply-form/ReplyForm";

const unmounters = [];
const useReplyForm = function (placeholder) {
  // [ ]TODO: Ensure only one unmounter gets added to the array per ReplyItem component rendered in the dom
  const [isVisible, setIsVisible] = useState();
  const unmounter = () => setIsVisible(false);
  unmounters.push(unmounter);

  const hideAll = () => {
    unmounters.forEach((unmounter) => unmounter());
  };

  const Empty = <></>;

  return {
    hideAll,

    show() {
      hideAll();
      setIsVisible(true);
    },

    ReplyFormAnchor(props) {
      if (isVisible) return <ReplyForm unmounter={hideAll} {...props} />;
      else return Empty;
    },
  };
};

export default useReplyForm;
