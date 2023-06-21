import { CartProductDto } from "../../../hooks/queries/useQueryCart";

const SummaryProduct = ({ product }: { product: CartProductDto }) => {
    const getTotalBrutto = () => (product.Quantity * product.PriceBrutto).toFixed(2);
    const getTotalDetails = () => `${product.Quantity} x ${product.PriceBrutto.toFixed(2)}`;

    return (
        <div className="flex items-center py-2 space-x-4">
            <div className="min-w-fit">
                <img className="w-14" src={product.ImageUrl} />
            </div>
            <div className="w-full text-lg">
                {product.Name}
            </div>
            <div className="min-w-fit pr-4 text-gray-400 font-medium">
                Ilość sztuk: {product.Quantity}
            </div>
            <div className="min-w-fit text-gray-700 font-medium space-x-1">
                <div>
                    <div className="flex gap-2">
                        <span>{getTotalBrutto()} zł brutto</span>
                        <span className="text-gray-500">({getTotalDetails()})</span>
                    </div>
                </div>
            </div>
            <div className="min-w-fit flex items-center space-x-1">
            </div>
        </div>
    );
}

export default SummaryProduct;