import Header from "@/components/header";
import BookingItem from "./_components/bookingItem";

const BookingUser = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto w-full max-w-7xl px-4 pb-20">
        <BookingItem />
      </div>
    </div>
  );
};

export default BookingUser;
