export default function Error(props) {
  return (
    <div
      style={{
        margin: "15px 0 15px 0",
        backgroundColor: "#ee6c4d",
        color: "white",
        padding: "15px",
        borderRadius: "5px",
      }}>
      {props.children}
    </div>
  );
}
