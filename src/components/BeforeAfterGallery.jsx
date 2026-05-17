import jetwashBefore from "../assets/work/jetwashbefore1.jpg";
import jetwashAfter from "../assets/work/jetwashafter1.jpg";

import buildingBefore from "../assets/work/building1a.jpg";
import buildingAfter from "../assets/work/building1b.jpg";

import propertyBefore from "../assets/work/property1a.jpg";
import propertyAfter from "../assets/work/property1b.jpg";

function BeforeAfterGallery() {
  const work = [
    {
      title: "High Pressure Jet Washing",
      description: "Patios, driveways and outdoor surfaces cleaned professionally.",
      before: jetwashBefore,
      after: jetwashAfter,
    },
    {
      title: "Building Maintenance",
      description: "Exterior care, repairs and property upkeep for managed buildings.",
      before: buildingBefore,
      after: buildingAfter,
    },
    {
      title: "Property Maintenance",
      description: "Reliable improvements and maintenance support for homes and businesses.",
      before: propertyBefore,
      after: propertyAfter,
    },
  ];

  return (
    <section style={section}>
      <div style={headerBox}>
        <p style={tagline}>Recent Work</p>
        <h2 style={title}>Before & After Projects</h2>
        <p style={subtitle}>
          Real examples of our property care, maintenance and exterior cleaning work.
        </p>
      </div>

      <div style={grid}>
        {work.map((item) => (
          <article key={item.title} style={card}>
            <div style={cardHeader}>
              <h3 style={cardTitle}>{item.title}</h3>
              <p style={description}>{item.description}</p>
            </div>

            <div style={imageGrid}>
              <div style={imageBox}>
                <span style={beforeBadge}>Before</span>
                <img src={item.before} alt={`${item.title} before`} style={image} />
              </div>

              <div style={imageBox}>
                <span style={afterBadge}>After</span>
                <img src={item.after} alt={`${item.title} after`} style={image} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const section = {
  padding: "70px 18px",
  backgroundColor: "#f5f7fb",
};

const headerBox = {
  textAlign: "center",
  maxWidth: "760px",
  margin: "0 auto 42px",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "800",
  margin: "0 0 8px",
  letterSpacing: "0.5px",
};

const title = {
  fontSize: "34px",
  margin: "0 0 12px",
  color: "#111827",
};

const subtitle = {
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: 0,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "28px",
  maxWidth: "1050px",
  margin: "0 auto",
};

const card = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "24px",
  border: "1px solid #dce6ef",
  boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
};

const cardHeader = {
  textAlign: "center",
  maxWidth: "720px",
  margin: "0 auto 22px",
};

const cardTitle = {
  fontSize: "24px",
  margin: "0 0 8px",
  color: "#1c2b44",
};

const description = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: 0,
};

const imageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const imageBox = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "18px",
  backgroundColor: "#e5e7eb",
};

const beforeBadge = {
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: "rgba(15,23,42,0.88)",
  color: "white",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
  zIndex: 2,
};

const afterBadge = {
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: "rgba(0,188,212,0.95)",
  color: "white",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
  zIndex: 2,
};

const image = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
  display: "block",
};

export default BeforeAfterGallery;