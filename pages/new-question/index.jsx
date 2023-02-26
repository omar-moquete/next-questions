import NewQuestion from "../../components/new-question/NewQuestion";
import RouteGuard from "../../components/route-guard/RouteGuard";

export default function NewQuestionPage() {
  return (
    <RouteGuard redirectPath="/login">
      <NewQuestion />
    </RouteGuard>
  );
}
