export const ErrorBanner = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div
      style={{
        backgroundColor: "#fee",
        color: "#c33",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #fcc",
        maxWidth: "500px",
        margin: "0 auto 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <strong>⚠️ {error}</strong>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#c33",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: "0",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
