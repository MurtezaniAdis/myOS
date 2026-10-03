export function PostHeader({ title, author, date, content }) {
  return (
    <div className="d-flex flex-column gap-2">
      <h4>{title}</h4>
      <div className="d-flex gap-3 mb-3">
        <span className="me-5">{author}</span>
        <span>{date}</span>
      </div>
      <p>{content}</p>
    </div>
  );
}
