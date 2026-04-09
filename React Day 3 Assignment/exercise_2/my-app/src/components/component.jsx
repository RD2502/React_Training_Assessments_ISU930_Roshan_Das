import styled from "styled-components";

const Card = styled.div`
  padding: 16px;
  border-radius: 6px;
  color: white;
  font-weight: bold;

  background-color: ${(props) =>
    props.type === "success"
      ? "green"
      : props.type === "error"
      ? "red"
      : "gray"};
`;

export default function StatusCard({ type, children }) {
  return <Card type={type}>{children}</Card>;
}