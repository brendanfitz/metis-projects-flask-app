from flask import render_template, request, Blueprint
from metis_app.blog_posts.db import blog_db

blog_posts = Blueprint('blog_posts', __name__)

@blog_posts.route('/<name>')
def blog(name):
    blog_data = blog_db[name]
    title = blog_data['title']
    template = blog_data['template']
    return render_template('api_sourcing.html', title=title)
