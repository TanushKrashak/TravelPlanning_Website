const fs = require('fs');
const path = require('path');

// Function to update the Review.html file to make reviews dynamic
function updateReviewPage() {
  try {
    console.log('Updating Review.html to make reviews dynamic...');
    
    // Path to the Review.html file
    const reviewFilePath = path.join(__dirname, '../../Html/Review.html');
    
    // Read the current content
    let content = fs.readFileSync(reviewFilePath, 'utf8');
    
    // Find the reviews section
    const reviewsSectionStart = content.indexOf('<div class="reviews-section">');
    const reviewsSectionEnd = content.indexOf('</div>', reviewsSectionStart);
    
    if (reviewsSectionStart === -1 || reviewsSectionEnd === -1) {
      console.error('Reviews section not found in the HTML file');
      return;
    }
    
    // Extract the reviews section
    const beforeReviews = content.substring(0, reviewsSectionStart);
    const afterReviews = content.substring(reviewsSectionEnd + 6);
    
    // Create the new dynamic reviews section
    const dynamicReviewsSection = `
    <div class="reviews-section">
      <h2>Customer Reviews</h2>
      <div id="reviews-container">
        <!-- Reviews will be loaded dynamically -->
        <div class="loading">Loading reviews...</div>
      </div>
    </div>
    
    <script>
      // Function to fetch and display reviews
      async function loadReviews() {
        try {
          const response = await fetch('http://localhost:5000/api/reviews/package/1');
          const reviews = await response.json();
          
          const reviewsContainer = document.getElementById('reviews-container');
          reviewsContainer.innerHTML = '';
          
          if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            return;
          }
          
          reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            
            // Create star rating
            let stars = '';
            for (let i = 1; i <= 5; i++) {
              if (i <= review.rating) {
                stars += '<span class="star filled">★</span>';
              } else {
                stars += '<span class="star">☆</span>';
              }
            }
            
            reviewElement.innerHTML = \`
              <div class="review-header">
                <div class="reviewer-info">
                  <h3>\${review.first_name} \${review.last_name}</h3>
                  <div class="rating">\${stars}</div>
                </div>
                <div class="review-date">\${new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <p class="review-comment">\${review.comment}</p>
            \`;
            
            reviewsContainer.appendChild(reviewElement);
          });
        } catch (error) {
          console.error('Error loading reviews:', error);
          document.getElementById('reviews-container').innerHTML = 
            '<p class="error">Failed to load reviews. Please try again later.</p>';
        }
      }
      
      // Load reviews when the page loads
      document.addEventListener('DOMContentLoaded', loadReviews);
    </script>
    `;
    
    // Combine the content
    const newContent = beforeReviews + dynamicReviewsSection + afterReviews;
    
    // Write the updated content back to the file
    fs.writeFileSync(reviewFilePath, newContent);
    
    console.log('Review.html updated successfully!');
  } catch (error) {
    console.error('Error updating Review.html:', error);
  }
}

// Run the update function
updateReviewPage(); 