import React from "react";
import "../../pictures/css/button.css";
import { useNavigate } from "react-router-dom";

export function Searchbar({ search, setSearch }) {
  return (
    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search distro..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export function AllDistros({ filteredDistros, onSelectDistro }) {
  const navigate = useNavigate();
  return (
    <div className="row">
      {filteredDistros.map((distro) => (
        <div
          key={distro.id}
          className="col-md-4 col-sm-6 mb-3"
          onClick={() => onSelectDistro(distro)}
          style={{ cursor: "pointer" }}
        >
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-center">
              <h5 className="card-title mb-0 text-center">{distro.name}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
