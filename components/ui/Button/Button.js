export default function Button(props) {
  return (
    <button
      style={{
        border: 0,
        backgroundColor: "#ee6c4d",
        color: "white",
        padding: "10px 15px 10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
      }}>
      {props.children}
    </button>
  );
}
