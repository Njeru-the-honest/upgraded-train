import { useState, useEffect } from "react";
import { getRestaurantFeedbacks, getRestaurantRating, submitFeedback } from "../services/api";
import { Star, User } from "lucide-react";

interface RestaurantReviewsProps {
  restaurantId: number;
}

const RestaurantReviews = ({ restaurantId }: RestaurantReviewsProps) => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    fetchRating();
  }, [restaurantId]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantFeedbacks(restaurantId);
      setFeedbacks(response.data);
      setError("");
    } catch (error: any) {
      console.error("Failed to load reviews", error);
      // Don't show error for 403 on public endpoints
      if (error.response?.status !== 403) {
        setError("Failed to load reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await getRestaurantRating(restaurantId);
      setAverageRating(response.data.averageRating || 0);
    } catch (error: any) {
      console.error("Failed to load rating", error);
      // Silently fail for rating if not available
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to submit a review");
      return;
    }

    if (!newComment.trim()) {
      setError("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      await submitFeedback({
        restaurantId,
        rating: newRating,
        comment: newComment.trim(),
      });

      // Reset form
      setNewRating(5);
      setNewComment("");
      setShowReviewForm(false);
      
      // Refresh reviews
      await fetchFeedbacks();
      await fetchRating();
      
      alert("Review submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit review", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Please login to submit a review");
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onClick?: (star: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onClick && onClick(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
        
        {feedbacks.length > 0 && (
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({feedbacks.length} {feedbacks.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
          
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Rating</label>
            {renderStars(newRating, true, setNewRating)}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Tell us about your experience..."
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {feedback.customerName || "Anonymous"}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {feedback.date || new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {renderStars(feedback.rating)}
                  {feedback.comment && (
                    <p className="text-gray-700 mt-2">{feedback.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;