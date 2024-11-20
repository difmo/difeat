import { IMG_CDN_URL } from "../constants";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";


const ItemList = ({items,storeId}) => {

    const dispatch = useDispatch();

    const addFoodItem = (item,storeId) => {
      dispatch(addItem({
        storeId:storeId,
        name: item.name,
        price: item.price || item.price,
        productImageUrl: item?.productImageUrl,
        quantity: item.inStock,
        productId: item?.productId,
        description: item?.description,
        category:item?.category
      }));
    };
    
    return(<div className="">
          {items.map((item) => {
            return (
              <div  className="flex flex-col justify-between border-b pb-6 mb-4 gap-6 md:flex-row"
              key={item?.card?.info?.id}>
                <div className="flex flex-col gap-2 w-full md:w-3/4"> 
                <span className="font-semibold">
                    {item?.name}
                  </span>
                  <div className="flex items-center gap-2">
                   <span className="font-semibold">
                   &#8377;
                   {item.price || item.price}
                   </span>
                  </div>
                  <p className="text-xs text-[#535665] ">
                    {item?.description}
                  </p>
                </div>

                <div className=" flex flex-col gap-1 relative md:w-1/4 w-auto">
                <img className="w-32 h-24 rounded self-center object-cover"
                 src={item?.productImageUrl} alt="foodImage" />
                 <button
                className=" h-9 absolute bottom-[-8px] bg-white shadow-md border self-center text-[0.9rem] py-1 px-2 font-medium rounded  active:scale-90 hover:bg-orange-600 transition-all duration-300 ease-in-out text-green-500"
                onClick={() => addFoodItem(item,storeId)}
              >
                ADD TO CART
              </button>
                </div>
              </div>
            );
          
})}
        </div>
    )
};

export default ItemList;