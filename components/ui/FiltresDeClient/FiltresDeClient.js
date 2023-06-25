import Link from "next/link";
export default function FiltresDeClient(props) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Link
        style={{
          backgroundColor: "#ee6c4d",
          padding: "5px 15px 5px 15px",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
        href={`/${props.client}/`}>
        Tout
      </Link>
      {props.annees.map((annee, index) => (
        <Link
          style={{
            backgroundColor: "#ee6c4d",
            padding: "5px 15px 5px 15px",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
          href={`/${props.client}/${annee}`}
          key={index}>
          {annee}
        </Link>
      ))}
    </div>
  );
}
