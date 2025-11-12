export const LoadingSpinner = ({ message = "Loading...", size = "small" }) => {
  const spinnerSize = size === "small" ? "30px" : "40px";
  const borderSize = size === "small" ? "3px" : "4px";

  return (
    <div
      style={{
        display: "inline-block",
        width: spinnerSize,
        height: spinnerSize,
        border: `${borderSize} solid #e0e0e0`,
        borderTop: `${borderSize} solid #1DB954`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <LoadingSpinner size="large" />
      <p style={{ color: "#666", marginTop: "1rem" }}>{message}</p>
    </div>
  );
};
