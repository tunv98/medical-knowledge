# from . import db
#
# # create table
# class Audio(db.Model):
#     __tablename__ = "audio"
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.Text(), nullable=False)
#     author = db.Column(db.Text(), nullable=False)
#     position = db.Column(db.Text(), nullable=True)
#     refs = db.Column(db.Text(), nullable=False)
#     date = db.Column(db.DateTime, nullable=True)
#     content = db.Column(db.Text(), nullable=False)
#
#     def __init__(self, title, author, position, refs, date, content):
#         self.title = title
#         self.author = author
#         self.position = position
#         self.refs = refs
#         self.date = date
#         self.content = content
#
#     def to_json(self):
#         return {
#             'title': self.title,
#             'author': self.author,
#             'position': self.position,
#             'refs': self.refs,
#             'date': self.date,
#             'content': self.content
#         }
#
#
# # db.drop_all()
# # db.create_all()
#
# # end database