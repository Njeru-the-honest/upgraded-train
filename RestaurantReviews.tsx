import { useState, useEffect } from "react";
import { getRestaurantFeedbacks, getRestaurantRating } from "../services/api";
import { Star, User } from "lucide-react";

interface RestaurantReviewsProps {
  restaurantId: number;
}

const RestaurantReviews = ({ restaurantId }: RestaurantReviewsProps) => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
    fetchRating();
  }, [restaurantId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await getRestaurantFeedbacks(restaurantId);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await getRestaurantRating(restaurantId);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Failed to load rating");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
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

      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
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
                    <h4 className="font-semibold text-gray-900">{feedback.customerName}</h4>
                    <span className="text-sm text-gray-500">{feedback.date}</span>
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