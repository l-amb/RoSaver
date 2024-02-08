// content.js

// Function to extract product ID from the current page URL
function getProductIdFromUrl() {
  const url = window.location.href;
  const match = url.match(/\/catalog\/(\d+)/);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

// Function to adjust prices
function adjustPrices() {
  const priceContainers = document.querySelectorAll('.shopping-cart.item-details-info-content .text-robux-lg');

  priceContainers.forEach(function (priceContainer) {
    const oldPrice = priceContainer.textContent.trim().replace(/,/g, ''); // Remove commas from the price
    const newPrice = calculateAdjustedPrice(oldPrice);

    // Update the existing Robux text with the adjusted price
    priceContainer.innerHTML = `${oldPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (💵${newPrice})`;
  });
}

// Function to calculate adjusted price
function calculateAdjustedPrice(oldPrice) {
  // Calculate the adjusted price as 60% of the old price
  const adjustedPrice = 0.6 * parseInt(oldPrice);
  return Math.round(adjustedPrice);  // Rounding to the nearest whole number
}

// Function to create and append the "Save" button
function createSaveButton() {
  const buyButtonContainer = document.querySelector('.shopping-cart.item-details-info-content .shopping-cart-buy-button');

  if (buyButtonContainer) {
    const buyButton = buyButtonContainer.querySelector('.PurchaseButton'); // Assuming the Buy button has the class 'PurchaseButton'

    if (buyButton) {
      const saveButton = document.createElement('button');
      saveButton.innerHTML = 'Save';
      saveButton.className = 'SaveButton'; // Add a class for styling
      saveButton.style.backgroundColor = 'blue'; // Set your desired color
      saveButton.style.color = 'white';
      saveButton.style.border = 'none'; // Remove border
      saveButton.style.borderRadius = '10px'; // Add border radius for roundness
      saveButton.style.padding = '15px 20px'; // Adjust padding for sizing
      saveButton.style.textAlign = 'center';
      saveButton.style.textDecoration = 'none';
      saveButton.style.display = 'block'; // Set to block to move to the next line
      saveButton.style.width = '388px'; // Set the width to match the container
      saveButton.style.marginTop = '10px'; // Adjust margin for spacing
      saveButton.style.cursor = 'pointer';

      // Add an event listener to handle the "Save" button click
      saveButton.addEventListener('click', function () {
        const productId = getProductIdFromUrl();
        if (productId) {
          const gameLink = `roblox://placeId=11173620418&launchData=${productId}`;
          window.open(gameLink, '_blank');
        } else {
          console.error('Product ID not found.');
        }
      });

      // Insert the "Save" button above the "Add to cart" button
      const addToCartButtonContainer = buyButtonContainer.querySelector('.shopping-cart-add-remove-btn-container');
      buyButtonContainer.insertBefore(saveButton, addToCartButtonContainer);
    }
  }
}

// Initial adjustment on extension load
chrome.storage.sync.get(['enablePriceDisplay'], function (result) {
  if (result.enablePriceDisplay) {
    setTimeout(function () {
      adjustPrices();
      createSaveButton(); // Create the "Save" button
    }, 500); // Reduced delay to 500 milliseconds
  }
});

// Message listener for adjusting prices and creating the "Save" button
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.enablePriceDisplay) {
    adjustPrices();
    createSaveButton(); // Create the "Save" button
  }
});
