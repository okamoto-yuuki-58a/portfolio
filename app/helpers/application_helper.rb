module ApplicationHelper
  def display_error(object, attribute)
    if object.errors[attribute].any?
      content_tag(:span, object.errors[attribute].first, class: 'error-message')
    end
  end
end
