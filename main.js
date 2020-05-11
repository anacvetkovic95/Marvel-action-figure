var eventBus = new Vue();

Vue.component("product", {
  template: `
    <div class="product">

        <div class="product-image">
            <img :src="image" :alt="image">
        </div>

        <div class="product-info">

            <h1>{{product}}</h1>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ 'text-decoration': !inStock }">Out of stock</p>

            <ul>
                <li v-for="detail in details">{{detail}}</li>
            </ul>

            <div class="version" v-for="(variant,index) in variants" @mouseover="updateProduct(index)"
                :key="variant.variantId">
                {{ variant.variantName }}
            </div>

            <button @click="addToCart()" :disabled="!inStock" :class="{disabledButton: !inStock}" class="btn btn-warning">Add to
            Cart</button> 

            <div>
                <button class="btn btn-danger" @click="removeFromCart()">Remove
                from
                Cart</button>
            </div>
          
              <product-tabs :reviews="reviews"></product-tabs>
              
        </div>

    </div>
`,
  data() {
    return {
      product: "Iron man action figure",
      selectedVariant: 0,
      details: [
        'Scale: 6.3"',
        "Product Type: Action Figure",
        "Character: Iron Man",
      ],
      variants: [
        {
          variantId: 123,
          variantName: "Grown",
          variantImage: "1.Iron man.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 234,
          variantName: "Baby",
          variantImage: "2.Baby iron man.jpg",
          variantQuantity: 0,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
  },
  computed: {
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    
      <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommendation required.");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
  <div>
    <span class="tab" 
      :class="{ activeTab: selectedTab === tab }"
      v-for="(tab, index) in tabs"  
      :key="index"
      @click=" selectedTab = tab">
      {{tab}}
    </span>

    <div v-show="selectedTab === 'Reviews'">
      <p class="p"
        v-if="!reviews.length">There are no reviews yet.
      </p>
        <ul>
            <li v-for="review in reviews">
            <p>Name:{{review.name}}</p>
            <p>Review:{{review.review}}</p>  
            <p>Rating:{{review.rating}}</p>  
            <p>Recommend:{{review.recommend}}</p>
            </li>
        </ul>
    </div>
    
    <product-review 
      v-show="selectedTab === 'Make a review'">
    </product-review>

  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a review"],
      selectedTab: "Reviews",
    };
  },
});

var app = new Vue({
  el: "#app",
  data: {
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      this.cart.pop(id);
    },
  },
});
