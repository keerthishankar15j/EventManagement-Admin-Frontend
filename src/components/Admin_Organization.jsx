
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin_Organization.css";

const API_URL = import.meta.env.VITE_API_URL;

const Admin_Organization = () => {

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET ORGANIZATION REQUESTS
  // ==========================================

  const fetchOrganizations = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/organization/getrequests`
      );

      setOrganizations(response.data);

    } catch (error) {

      console.error(
        "Error fetching organizations:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // ==========================================
  // APPROVE REQUEST
  // ==========================================

  const approveOrganization = async (id) => {

    try {

      await axios.put(
        `${API_URL}/organization/approve/${id}`
      );

      alert("Organization approved successfully");

      fetchOrganizations();

    } catch (error) {

      console.error(error);
      alert("Failed to approve organization");

    }

  };

  // ==========================================
  // REJECT REQUEST
  // ==========================================

  const rejectOrganization = async (id) => {

    try {

      await axios.put(
        `${API_URL}/organization/reject/${id}`
      );

      alert("Organization rejected");

      fetchOrganizations();

    } catch (error) {

      console.error(error);
      alert("Failed to reject organization");

    }

  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="organization-page">

      <div className="organization-header">

        <h1>Organization Requests</h1>

        <p>
          Manage organization registration requests
        </p>

      </div>

      {loading ? (

        <p>Loading organization requests...</p>

      ) : organizations.length === 0 ? (

        <p>No organization requests found.</p>

      ) : (

        <div className="organization-table-wrapper">

          <table className="organization-table">

            <thead>

              <tr>

                <th>S.No</th>
                <th>Organization Name</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {organizations.map((organization, index) => (

                <tr key={organization._id}>

                  <td>{index + 1}</td>

                  <td>
                    {organization.organizationName}
                  </td>

                  <td>
                    {organization.name}
                  </td>

                  <td>
                    {organization.email}
                  </td>

                  <td>

                    <span
                      className={`status ${organization.status}`}
                    >
                      {organization.status}
                    </span>

                  </td>

                  <td>

                    <div className="organization-actions">

                      <button
                        className="approve-btn"
                        onClick={() =>
                          approveOrganization(
                            organization._id
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          rejectOrganization(
                            organization._id
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default Admin_Organization;