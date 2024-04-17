import { useRouter } from "next/router";

const Pagination = ({ page, totalPages }) => {
  const router = useRouter();
  const { search, limit = "10" } = router.query; // Ensure limit is treated as a string

  const createPageUrl = (targetPage) => {
    // Start with the page parameter
    let url = `/?page=${targetPage}`;

    // Only add the limit parameter to the URL if it's not the default value
    if (limit !== "10") {
      url += `&limit=${limit}`;
    }

    // Add the search term if it exists
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return url;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-4">
      {page > 1 && (
        <a
          href={createPageUrl(page - 1)}
          className="px-4 py-2 border bg-gray-200"
        >
          Previous
        </a>
      )}
      {page < totalPages && (
        <a
          href={createPageUrl(page + 1)}
          className="px-4 py-2 border bg-gray-200"
        >
          Next
        </a>
      )}
    </div>
  );
};

export default Pagination;
