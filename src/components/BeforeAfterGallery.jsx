import jetwashBefore from "../assets/work/jetwashbefore1-960.webp";
import jetwashBeforeSmall from "../assets/work/jetwashbefore1-480.webp";
import jetwashAfter from "../assets/work/jetwashafter1-960.webp";
import jetwashAfterSmall from "../assets/work/jetwashafter1-480.webp";

import buildingBefore from "../assets/work/building1a-960.webp";
import buildingBeforeSmall from "../assets/work/building1a-480.webp";
import buildingAfter from "../assets/work/building1b-960.webp";
import buildingAfterSmall from "../assets/work/building1b-480.webp";

import propertyBefore from "../assets/work/property1a-960.webp";
import propertyBeforeSmall from "../assets/work/property1a-480.webp";
import propertyAfter from "../assets/work/property1b-960.webp";
import propertyAfterSmall from "../assets/work/property1b-480.webp";

function BeforeAfterGallery() {
  const work = [
    {
      title: "High Pressure Jet Washing",
      description: "Patios, driveways and outdoor surfaces cleaned professionally.",
      before: jetwashBefore,
      beforeSmall: jetwashBeforeSmall,
      after: jetwashAfter,
      afterSmall: jetwashAfterSmall,
    },
    {
      title: "Building Maintenance",
      description: "Exterior care, repairs and property upkeep for managed buildings.",
      before: buildingBefore,
      beforeSmall: buildingBeforeSmall,
      after: buildingAfter,
      afterSmall: buildingAfterSmall,
    },
    {
      title: "Property Maintenance",
      description: "Reliable improvements and maintenance support for homes and businesses.",
      before: propertyBefore,
      beforeSmall: propertyBeforeSmall,
      after: propertyAfter,
      afterSmall: propertyAfterSmall,
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
                <img loading="lazy" decoding="async" width="600" height="260" src={item.before} srcSet={`${item.beforeSmall} 480w, ${item.before} 960w`} sizes="(max-width: 580px) calc(100vw - 84px), (max-width: 1126px) calc((100vw - 100px) / 2), 475px" alt={`${item.title} before`} style={image} />
              </div>

              <div style={imageBox}>
                <span style={afterBadge}>After</span>
                <img loading="lazy" decoding="async" width="600" height="260" src={item.after} srcSet={`${item.afterSmall} 480w, ${item.after} 960w`} sizes="(max-width: 580px) calc(100vw - 84px), (max-width: 1126px) calc((100vw - 100px) / 2), 475px" alt={`${item.title} after`} style={image} />
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
  color: "#006f80",
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
  color: "#52627a",
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
  color: "#52627a",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: 0,
};

const imageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
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
  backgroundColor: "#006f80",
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