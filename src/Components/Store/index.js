import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddToCartAnimation } from "../Utils";
import { DISPLAY_CATEGORY } from "../../Constants/generalConstants";
import { Helmet } from "react-helmet";
import "../../CSS/HomePage.css";
import "../../CSS/Store.css";
import "../../CSS/Homepage/SubscribeInput.css";
import StoreHeader from "./Header/StoreHeader";
import ProductsList from "./ProductsList";
import useCart from "../../Hooks/useCart";
import CategoryBar from "./Header/CategoryBar";
import useWindowSize from "../../Hooks/useWindowSize";
import CategoryImages from "./CategoryImages";
import Breadcrumb from "../Breadcrumb";

function StoreHome(props) {
  const search = useSelector((state) => state.search);
  const category = useSelector((state) => state?.general.category);
  const size = useWindowSize();
  const cartObject = useCart();
  const dispatch = useDispatch();
  const categoryId = props.cid;

  useEffect(() => {
    if (categoryId) dispatch({ type: DISPLAY_CATEGORY, payload: categoryId });
  }, [categoryId]);

  const CategoryImagesRender = () => {
    if (search && search.filterBy?.length > 0) return null;
    else return <CategoryImages />;
  };

  return (
    <div className="store-container">
      <Helmet>
        <title>IM.Barber - חנות המוצרים</title>‍
        <meta
          name="description"
          content="חנות המוצרים של IM.Barber - כל מוצרי הטיפוח הכי שווים לגבר, במחירי רצפה!"
        />
      </Helmet>
      <AddToCartAnimation />
      <StoreHeader
        cart={cartObject.cart}
        count={cartObject.count}
        totalSum={cartObject.totalSum}
      />
      {size.width > 768 ? <CategoryBar /> : null}
      <div style={{ marginTop: "2%" }}></div>
      <Breadcrumb
        PageArr={[
          { name: "דף הבית", url: "/" },
          { name: "חנות המוצרים", url: "/store" },
        ]}
      />
      {!category && CategoryImagesRender()}
      <ProductsList addToCart={cartObject.addToCart} category={categoryId} />
    </div>
  );
}
export default StoreHome;
