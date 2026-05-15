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
      description: "Patio and outdoor surface cleaning.",
      before: jetwashBefore,
      after: jetwashAfter,
    },
    {
      title: "Building Maintenance",
      description: "Exterior property care and maintenance support.",
      before: buildingBefore,
      after: buildingAfter,
    },
    {
      title: "Property Maintenance",
      description: "General property improvements and upkeep.",
      before: propertyBefore,
      after: propertyAfter,
    },
  ];

  return (
    <section style={section}>
      <div style={headerBox}>
        <p style={tagline}>Our Work</p>
        <h2 style={title}>Recent Projects</h2>
        <p style={subtitle}>
          A selection of completed maintenance and outdoor cleaning work.
        </p>
      </div>

      <div style={grid}>
        {work.map((item) => (
          <article key={item.title} style={card}>
            <h3 style={cardTitle}>{item.title}</h3>
            <p style={description}>{item.description}</p>

            <div style={imageGrid}>
              <div style={imageBox}>
                <span style={badge}>Before</span>
                <img src={item.before} alt={`${item.title} before`} style={image} />
              </div>

              <div style={imageBox}>
                <span style={badge}>After</span>
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
  padding: "65px 20px",
  backgroundColor: "#ffffff",
};

const headerBox = {
  textAlign: "center",
  maxWidth: "720px",
  margin: "0 auto 38px",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "bold",
  margin: "0 0 8px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "22px",
  maxWidth: "1120px",
  margin: "0 auto",
};

const card = {
  backgroundColor: "#f8fafc",
  borderRadius: "22px",
  padding: "20px",
  border: "1px solid #dce6ef",
  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
};

const cardTitle = {
  fontSize: "22px",
  margin: "0 0 8px",
  color: "#1c2b44",
};

const description = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "0 0 18px",
};

const imageGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const imageBox = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "16px",
  backgroundColor: "white",
};

const badge = {
  position: "absolute",
  top: "10px",
  left: "10px",
  backgroundColor: "rgba(15,23,42,0.85)",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
  zIndex: 2,
};

const image = {
  width: "100%",
  height: "210px",
  objectFit: "cover",
  display: "block",
};

export default BeforeAfterGallery;