class RelatedController < ApplicationController
  before_action :set_related, only: %i[ show ]

  def show
    render json: {:contents => @contents_categories}
  end

  private
    def set_related
      content = Content.find(params[:id])
      categories = content.categories
      cat_id = []      
      categories.each do |category|
        next if category.category_type == 'country'
        cat_id << category.category_id
      end

      cont_cat = ContentCategory.where('category_id IN (?) AND content_id != ?', cat_id, params[:id])
      content_ids = []
      cont_cat.each do |content_category|
        content_ids << content_category.content_id
      end
      content_ids = content_ids.uniq
      contents = Content.where('content_id IN (?)', content_ids)

      @contents_categories = []
      contents.each do |content|
        @contents_categories << content.as_json.merge!({:categories => content.categories}.as_json)
      end
    end  
end