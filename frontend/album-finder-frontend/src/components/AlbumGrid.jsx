export const AlbumGrid = ({ albums, isLoading }) => {
  if (isLoading) {
    return null; // LoadingOverlay is shown separately
  }

  if (albums.length === 0) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <p style={{ color: "#777" }}>
          Search for an artist to see their albums...
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};

const AlbumCard = ({ album }) => {
  return (
    <div
      style={{
        margin: "16px",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        width: "200px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 6px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <img
        src={album.images[0]?.url}
        alt={album.name}
        width="200"
        height="200"
        style={{ borderRadius: "8px", width: "100%" }}
      />
      <p
        style={{
          fontWeight: "600",
          fontSize: "1.1rem",
          margin: "12px 0 4px 0",
          color: "#222",
        }}
      >
        {album.name}
      </p>
      <p
        style={{
          color: "#666",
          fontSize: "0.9rem",
          margin: "0",
        }}
      >
        {new Date(album.release_date).getFullYear()}
      </p>
    </div>
  );
};
