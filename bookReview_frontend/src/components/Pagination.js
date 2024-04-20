import { useRouter } from "next/router";

const Pagination = ({ page, totalPages }) => {
  const router = useRouter();
 const { search, sort, order, limit = "10" } = router.query;

 const createPageUrl = (targetPage) => {
   const queryParams = new URLSearchParams({
     page: targetPage,
     limit,
     ...(search && { search }),
     ...(sort && { sort }),
     ...(order && { order }),
   });

   return `/?${queryParams.toString()}`;
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
