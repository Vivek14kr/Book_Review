const BookDetail = ({ book }) => (
  <div className="bg-white shadow overflow-hidden rounded-lg p-6 mt-8">
    <div className="flex flex-col md:flex-row">
      <img
        src={book.cover_image_url || "/no-image.png"}
        alt={book.title}
        className="w-48 h-auto rounded-lg shadow-md"
      />
      <div className="mt-4 md:mt-0 md:ml-6">
        <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{book.author}</p>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Description:</h3>
          <p className="text-gray-600 mt-1">{book.description}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Genre:</h3>
          <p className="text-gray-600">{book.genre}</p>
        </div>
      </div>
    </div>
  </div>
);

export default BookDetail;
