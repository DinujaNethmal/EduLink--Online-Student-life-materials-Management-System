// ============================================================
// controllers/cartController.js — Shopping Cart Operations
// ============================================================
// Handles all cart-related business logic:
//   - Get a user's cart (with calculated total)
//   - Add an item to the cart (or increment quantity if already there)
//   - Update the quantity of an item in the cart
//   - Remove a specific item from the cart
//   - Clear the entire cart
// ============================================================

const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * GET /api/cart/:userId
 * Retrieve a user's cart with full product details and calculated total.
 *
 * .populate("items.product") replaces the product ObjectId with the
 * actual product document, so the frontend gets name, price, image, etc.
 */
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the cart and replace product IDs with full product data
    const cart = await Cart.findOne({ userId }).populate("items.product");

    // If user has no cart yet, return an empty cart structure
    if (!cart) {
      return res.json({ userId, items: [], totalAmount: 0 });
    }

    // Calculate the total price of all items in the cart
    // For each item: product price * quantity, then sum them all up
    const totalAmount = cart.items.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum; // Skip if product was deleted from the database
    }, 0);

    res.json({
      userId: cart.userId,
      items: cart.items,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};

/**
 * POST /api/cart/add
 * Add an item to the user's cart.
 *
 * Request body: { userId, productId, quantity }
 *
 * Logic:
 *   - If the user has no cart → create one with this item
 *   - If the product is already in the cart → increase the quantity
 *   - Otherwise → add the product as a new cart item
 */
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Validate required fields
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Check if the product exists and is still available for purchase
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ message: "Product is no longer available" });
    }

    // Look for an existing cart for this user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // No cart exists — create a brand new cart with this item
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Cart exists — check if this product is already in it
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId // Compare ObjectId as string
      );

      if (existingItem) {
        // Product already in cart — just bump up the quantity
        existingItem.quantity += quantity;
      } else {
        // New product — add it to the items array
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save the cart (either newly created or updated)
    await cart.save();

    // Re-fetch the cart with populated product details for the response
    const updatedCart = await Cart.findOne({ userId }).populate("items.product");

    // Calculate the updated total
    const totalAmount = updatedCart.items.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    res.status(200).json({
      message: "Item added to cart",
      cart: {
        userId: updatedCart.userId,
        items: updatedCart.items,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

/**
 * PUT /api/cart/update
 * Update the quantity of a specific item in the cart.
 *
 * Request body: { userId, productId, quantity }
 *
 * If quantity <= 0, the item is removed from the cart entirely.
 */
const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate all required fields are present
    if (!userId || !productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "userId, productId, and quantity are required" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the specific item in the cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Quantity is 0 or negative — remove the item from the cart entirely
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      // Update to the new quantity
      item.quantity = quantity;
    }

    await cart.save();

    // Re-fetch with populated product data for the response
    const updatedCart = await Cart.findOne({ userId }).populate("items.product");

    // Recalculate total
    const totalAmount = updatedCart.items.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    res.json({
      message: "Cart updated",
      cart: {
        userId: updatedCart.userId,
        items: updatedCart.items,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

/**
 * DELETE /api/cart/:userId/item/:productId
 * Remove a specific item from the user's cart.
 */
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to remove (keep everything EXCEPT the matching productId)
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Re-fetch with populated product data
    const updatedCart = await Cart.findOne({ userId }).populate("items.product");

    // Recalculate total
    const totalAmount = updatedCart.items.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    res.json({
      message: "Item removed from cart",
      cart: {
        userId: updatedCart.userId,
        items: updatedCart.items,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

/**
 * DELETE /api/cart/:userId
 * Clear all items from the user's cart (empty it out).
 * Used when user wants to start fresh, or after checkout.
 */
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Empty the items array
    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart: { userId, items: [], totalAmount: 0 } });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};

// Export all cart controller functions for use in routes
module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
