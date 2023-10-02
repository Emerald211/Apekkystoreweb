import { useNavigate } from "react-router-dom";
import Button from "../button/button.component";

const PopularCategories = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" mt-12 mb-12 relative font-serrat">
        <div className=" text-center flex flex-col justify-center items-center tracking-wide">
          <h1 className=" tracking-wide">FEATURED COLLECTION</h1>
          <h1 className=" tracking-widest  text-3xl">BEST SELLERS</h1>
          <div className="  bg-[#FF01FD] h-1 w-24 rounded-md mt-1"></div>
        </div>
      </div>

      <div className=" mt-20 flex justify-center py-5 items-center">
        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-5  md:gap-10">
          <div  className=" px-5 border-purple-500  text-center bg-cover  border w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] flex flex-col justify-center items-center text-white ">
            <img
              src="https://i.ibb.co/jh8W8k8/category1.jpg"
              className=""
              alt=""
            />
            <h2 className=" text-main text-sm mt-3 md:text-base font-bold">
              BATHING SPA
            </h2>
          </div>

          <div
            
            className=" border border-main bg-cover w-[150px] h-[150px] md:w-[300px] md:h-[300px] flex flex-col justify-center items-center text-white "
          >
            <div className=" px-5 border-purple-500  text-center bg-cover  border w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] flex flex-col justify-center items-center text-white ">
              <img
                src="https://i.ibb.co/41zRqvG/category2.jpg"
                className=""
                alt=""
              />
              <h2 className=" text-main text-sm mt-3 md:text-base font-bold">
                BODY CREAM
              </h2>
            </div>
          </div>

          <div                className=" border border-main bg-cover w-[150px] h-[150px] md:w-[300px] md:h-[300px] flex flex-col justify-center items-center text-white ">
            <div className=" px-5 border-purple-500  text-center bg-cover  border w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] flex flex-col justify-center items-center text-white ">
              <img
                src="https://i.ibb.co/ZKfx1V5/category3.jpg"
                className=""
                alt=""
              />
              <h2 className=" text-main text-sm mt-3 md:text-base font-bold">
                BODY LOTION
              </h2>
            </div>
          </div>

          <div
           
            className=" bg-cover w-[150px] h-[150px] md:w-[300px] md:h-[300px] flex flex-col justify-center items-center text-white "
          >
            <div className=" px-5 border-purple-500  text-center bg-cover  border w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] flex flex-col justify-center items-center text-white ">
              <img
                src="https://i.ibb.co/qCSrDFP/category1.jpg"
                className=""
                alt=""
              />
              <h2 className=" text-main text-sm mt-3 md:text-base font-bold">
                BODY SERUM
              </h2>
            </div>

            {/* <div className=" text-sm md:text-base text-center bg-gray-400 rounded-md p-4 w-full h-full flex flex-col justify-center items-center bg-clip-padding hover:backdrop-filter hover:backdrop-blur-sm bg-opacity-10 border border-gray-100">
              <h1 className="z-30 mb-5">Body Serums</h1>

              <Button
                onClick={() => navigate("/shop/serums")}
                buttonType="inverted"
                type="button"
              >
                SHOP NOW
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      <div className=" mt-20 flex flex-col w-full justify-center items-center mb-7">
        <h1 className=" font-serrat text-3xl ">Best Seller Products</h1>
        <p className=" text-xl mt-3 text-center px-10 lg:px-52 w-full md:w-[70vw] mb-10 ">
          Select from our best-selling product categories. Your beauty is our
          priority. Your beauty and confidence lies within you
        </p>

        <Button
          onClick={() => navigate("/shop")}
          type="button"
          buttonType="inverted"
        >
          {" "}
          VIEW ALL PRODUCTS
        </Button>
      </div>
    </div>
  );
};

export default PopularCategories;
