"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { FaEye, FaDownload } from "react-icons/fa";
import Sidebar from "../../sidebar/page";
import Header from "../../header/page";

const SignedUpCustomer = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const [allData, setData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("from1to31");

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
  };

  const fetchAlldata = async () => {
    let data = await fetch(
      `https://api.addrupee.com/api/get_signedup_customer?filter=${selectedFilter}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    let result = await data.json();
    if (!Array.isArray(result)) {
      return;
    }
    setData(result);
  };

  const handleSignedUpDataDelete = async (_id) => {
    try {
      const response = await fetch(
        `https://api.addrupee.com/api/delete_signedup_customer/${_id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        fetchAlldata();
      } else {
        console.error("Error deleting data:", result.error);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    fetchAlldata();
  }, [selectedFilter]);

  useEffect(() => {
    const sorted = [...allData].sort((a, b) => {
      const dateA = new Date(a.signedUpDate);
      const dateB = new Date(b.signedUpDate);

      const compareResult = dateB - dateA;
      return sortOrder === "asc" ? compareResult : -compareResult;
    });

    setSortedData(sorted);
  }, [allData, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const filteredData = sortedData.filter((data) => {
    const searchString = searchItem.toLowerCase();

    const lowercaseData = {
      name: data.name ? data.name.toLowerCase() : "",
      mobileNo: data.phone ? data.phone.toLowerCase() : "",
      email: data.email ? data.email.toLowerCase() : "",
      signedUpDate: data.signedUpDate ? data.signedUpDate.toLowerCase() : "",
    };

    return (
      lowercaseData.name.includes(searchString) ||
      lowercaseData.mobileNo.includes(searchString) ||
      lowercaseData.email.includes(searchString) ||
      lowercaseData.signedUpDate.includes(searchString)
    );
  });

  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleDownload = () => {
    const fieldsToExclude = [
      "_id",
      "__v",
      "password",
      "is_verified",
      "verificationCode",
    ];

    const filteredDataWithoutFieldsToExclude = filteredData.map((data) => {
      const newData = { ...data };
      fieldsToExclude.forEach((field) => delete newData[field]);
      newData.signedUpDate = format(new Date(data.signedUpDate), "dd/MM/yyyy");
      return newData;
    });

    const ws = XLSX.utils.json_to_sheet(filteredDataWithoutFieldsToExclude);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const userConfirmed = window.confirm(
      "Are you sure you want to download the file?"
    );

    if (userConfirmed) {
      XLSX.writeFile(wb, "data.xlsx");
    } else {
      alert("Download canceled.");
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex" }}>
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <section
          style={{
            backgroundColor: "#E7E5E5",
            width: "100%",
            height: "100vh",
            overflowY: "scroll",
          }}
        >
          <Header OpenSidebar={OpenSidebar} />
          <div className="container" style={{ padding: "20px" }}>
            <div className="row">
              <div className="col-12 col-lg-4 col-md-4 mb-2">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </div>
              <div className="col-12 col-lg-4 col-md-4 mb-2">
                {allData.length > 0 ? (
                  <div className="btn btn-danger" onClick={handleDownload}>
                    <span
                      style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Download
                      <FaDownload
                        style={{ paddingLeft: "5px", fontSize: "18px" }}
                      />
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="col-12 col-lg-4 col-md-4 mb-2">
                <select
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  value={selectedFilter}
                  className="form-select"
                >
                  <option value="from1to31" selected>
                    Select Date Filter
                  </option>
                  <option value="lastday">From Last Day</option>
                  <option value="last7days">From Last 7 Days</option>
                  <option value="last30days">From Last 30 Days</option>
                  <option value="all">All Data</option>
                </select>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ fontSize: "14px" }} scope="col">
                      S. No.
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      Customer Name{" "}
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      Mobile No
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      Email Id
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      Sign Up Date
                      <span style={{ cursor: "pointer" }} onClick={handleSort}>
                        {sortOrder === "asc" ? " ⬆" : " ⬇"}
                      </span>
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      View
                    </th>
                    <th style={{ fontSize: "14px" }} scope="col">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((data, index) => (
                    <tr key={index} onClick={() => handleRowClick(data)}>
                      <td style={{ fontSize: "14px" }}>
                        {startIndex + index + 1}
                      </td>
                      <td style={{ fontSize: "14px" }}>{data.name}</td>
                      <td style={{ fontSize: "14px" }}>{data.phone}</td>
                      <td style={{ fontSize: "14px" }}>{data.email}</td>
                      <td style={{ fontSize: "14px" }}>
                        {format(new Date(data.signedUpDate), "dd/MM/yyyy")}
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        <button
                          type="button"
                          style={{
                            backgroundColor: "transparent",
                            fontSize: "22px",
                            border: "none",
                            color: "darkblue",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          <FaEye />
                        </button>
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        <div
                          className="m-2"
                          style={{
                            color: "red",
                            backgroundColor: "transparent",
                            fontSize: "22px",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSignedUpDataDelete(data._id)}
                        >
                          <MdDelete />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <!-- Modal --> */}
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Customer Inquiry Data
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    {selectedRowData && (
                      <div>
                        <p>Customer Name: {selectedRowData.name}</p>
                        <p>Mobile No: {selectedRowData.phone}</p>
                        <p>Email: {selectedRowData.email}</p>
                        <p>
                          Sign Up Date:{" "}
                          {format(
                            new Date(selectedRowData.signedUpDate),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  cursor: pageIndex === 0 ? "not-allowed" : "pointer",
                  border: "none",
                  color: pageIndex === 0 ? "black" : "white",
                  backgroundColor: pageIndex === 0 ? "lightgray" : "black",
                  borderRadius: "6px",
                  marginRight: "4px",
                }}
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
              >
                Prev
              </button>
              <span>
                <strong>{pageIndex + 1}</strong> of{" "}
                {Math.ceil(filteredData.length / pageSize)}
              </span>
              <button
                style={{
                  cursor:
                    endIndex >= filteredData.length ? "not-allowed" : "pointer",
                  border: "none",
                  color: endIndex >= filteredData.length ? "black" : "white",
                  backgroundColor:
                    endIndex >= filteredData.length ? "lightgray" : "black",
                  borderRadius: "6px",
                  marginLeft: "4px",
                }}
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={endIndex >= filteredData.length}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignedUpCustomer;
