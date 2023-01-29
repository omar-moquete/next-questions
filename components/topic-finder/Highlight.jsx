import classes from "./Highlight.module.scss";

export default function Highlight({ value }) {
  return <em className={classes.highlight}>{value}</em>;
}
