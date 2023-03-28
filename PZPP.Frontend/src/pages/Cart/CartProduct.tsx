const CartProduct = () => {
    return (
        <div className="flex items-center py-2 space-x-4">
            <div className="min-w-fit">
                <img className="w-14" src='https://cdn3.botland.com.pl/105021-pdt_540/kamera-arducam-ov5647-5mpx-z-obiektywem-ls-2718-cs-mount-dla-raspberry-pi.jpg' />
            </div>
            <div className="w-full text-lg">
                Komputer przenośny Berryrasp 4c
            </div>
            <div className="min-w-fit pr-4 text-gray-400 font-medium">
                Ilość sztuk: 4x
            </div>
            <div className="min-w-fit text-gray-700 font-medium space-x-1">
                <span>390,99 zł</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">173,00 zł</span>
            </div>
        </div>
    );
}

export default CartProduct;