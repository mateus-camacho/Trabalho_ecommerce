import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ShoppingBag, Trash } from "lucide-react";
import { useCart } from "@/contexts/cartContext";
import { LoaderCircle } from "lucide-react";
import { OrderService } from "@/core/services/order.service";

export default function Cart() {
  const { cartId, cart, loading, removeFromCart } = useCart();
  const orderService = OrderService();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = async () => {
    console.log("Checkout");
    console.log(cart);
    console.log(cartId);

    await orderService.checkout({
      cartId,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="h-7 w-7 transition-colors duration-300 hover:text-gray-300 flex items-center justify-center relative">
          <ShoppingBag size={20} />

          {cart.length > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Seu carrinho</SheetTitle>
          <SheetDescription>
            {cart.length
              ? `Você tem ${cart.length} itens no seu carrinho`
              : "Seu carrinho está vazio, adicione alguns itens para começar!"}
          </SheetDescription>
        </SheetHeader>

        {cart.length > 0 && (
          <>
            <Separator color="gray" className="my-6" />

            <ScrollArea
              className="pr-3 h-full"
              style={{
                maxHeight: "calc(100vh - 160px)",
                minHeight: "200px",
              }}
            >
              <div className="flex flex-col gap-2">
                {cart.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="w-full flex items-start justify-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex flex-col gap-1 mt-2">
                          <CardTitle>
                            {product.name.length > 50
                              ? product.name.substring(0, 50) + "..."
                              : product.name}
                          </CardTitle>
                          <CardDescription>{product.brand}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <CardDescription>
                          {product.quantity} x R${product.price} (R$
                          {(product.quantity * product.price).toFixed(2)})
                        </CardDescription>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:text-red-500"
                          onClick={() => handleRemoveItem(product.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator color="gray" className="my-6" />

              <div className="flex items-center justify-between pb-4 gap-4">
                <div className="w-full flex items-center justify-between text-sm text-gray-500">
                  <span>
                    <strong>Total: </strong>
                  </span>

                  <span>
                    R$
                    {cart
                      .reduce(
                        (acc, product) =>
                          acc + product.price * product.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="default"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={14}
                        className="text-blue-500 animate-spin"
                      />
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
