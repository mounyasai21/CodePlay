from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config.from_object('config.Config')

db = SQLAlchemy(app)

# ---------------- DATABASE MODELS ---------------- #
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # kid or parent
    screen_time = db.Column(db.Integer, default=60)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    level = db.Column(db.String(10))
    points = db.Column(db.Integer)
    date_played = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# ---------------- ROUTES ---------------- #
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        role = request.form['role']

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash("Username already exists!")
            return redirect(url_for('signup'))

        user = User(username=username, password=password, email=email, role=role)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully! Please login.")
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()

        if user:
            session['username'] = user.username
            session['role'] = user.role
            user.last_login = datetime.utcnow()
            db.session.commit()
            if user.role == 'parent':
                return redirect(url_for('parent_dashboard'))
            else:
                return redirect(url_for('dashboard'))
        else:
            flash("Invalid credentials!")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/parent_dashboard')
def parent_dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    users = User.query.filter_by(role='kid').all()
    scores = Score.query.all()
    return render_template('parent_dashboard.html', users=users, scores=scores)

@app.route('/level<int:level_id>', methods=['GET', 'POST'])
def level(level_id):
    if 'username' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        points = int(request.form['score'])
        new_score = Score(username=session['username'], level=str(level_id), points=points)
        db.session.add(new_score)
        db.session.commit()
        flash(f"Level {level_id} completed! Score saved.")
        return redirect(url_for('dashboard'))
    return render_template(f'level{level_id}.html', level=level_id)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
