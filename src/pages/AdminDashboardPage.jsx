import React, { useEffect, useState } from "react";

const AdminDashboardPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const paginateApi = async (page, limit) => {
    try {
      const response = await fetch(
        "https://reacttask.mkdlabs.com/v1/api/rest/video/PAGINATE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-project": "cmVhY3R0YXNrOmQ5aGVkeWN5djZwN3p3OHhpMzR0OWJtdHNqc2lneTV0Nw==",
            "Authentication": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            payload: {},
            page,
            limit,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch videos");
      }
  
      if (!data || !data.list || !data.list.length) {
        throw new Error("No videos found");
      }
  
      return {
        page: data.page,
        limit: data.limit,
        total: data.total,
        numPages: data.num_pages,
        list: data.list,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  

  const loadVideos = async () => {
    const data = await paginateApi(currentPage, 10);

    if (data) {
      setVideos(data.list);
      setTotalPages(data.numPages);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);


  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      const data = await paginateApi(currentPage + 1, 10);

      if (data) {
        setVideos(data.list);
        setCurrentPage(data.page);
      }
    }
  };

  const handlePrevButton = async () => {
    if (currentPage > 1) {
      const data = await paginateApi(currentPage - 1, 10);

      if (data) {
        setVideos(data.list);
        setCurrentPage(data.page);
      }
    }
  };
  return (
    <>
      <div className="w-full flex justify-center items-center text-7xl h-screen text-gray-700 ">
        Dashboard
      </div>
      <h1>Video List</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
      
    </>
  );
};

export default AdminDashboardPage;
