from flask import Flask, render_template, request, redirect, url_for, session, flash
from models.models import db, User, Score
from config import Config
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Create all tables once
with app.app_context():
    db.create_all()

# ---------------- HOME ---------------- #
@app.route('/')
def home():
    return render_template('index.html')

# ---------------- SIGNUP ---------------- #
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        role = request.form['role']
        parent_username = request.form.get('parent_username', None)

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash("Username already exists!")
            return redirect(url_for('signup'))

        new_user = User(username=username, email=email, password=password, role=role, parent_username=parent_username)
        db.session.add(new_user)
        db.session.commit()
        flash("Account created successfully! Please login.")
        return redirect(url_for('login'))
    return render_template('signup.html')

# ---------------- LOGIN ---------------- #
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username, password=password).first()
        if not user:
            flash("Invalid username or password!")
            return redirect(url_for('login'))

        session['username'] = user.username
        session['role'] = user.role
        user.last_login = datetime.utcnow()
        db.session.commit()

        if user.role == 'parent':
            return redirect(url_for('parent_dashboard'))
        else:
            return redirect(url_for('dashboard'))

    return render_template('login.html')

# ---------------- LOGOUT ---------------- #
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# ---------------- KID DASHBOARD ---------------- #
@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    username = session['username']
    scores = Score.query.filter_by(username=username).all()
    return render_template('dashboard.html', username=username, scores=scores)

# ---------------- PARENT DASHBOARD ---------------- #
@app.route('/parent_dashboard')
def parent_dashboard():
    if 'username' not in session' or session['role'] != 'parent':
        return redirect(url_for('login'))

    parent = session['username']
    kids = User.query.filter_by(parent_username=parent, role='kid').all()
    scores = Score.query.all()
    return render_template('parent_dashboard.html', kids=kids, scores=scores)

# ---------------- LEVELS ---------------- #
@app.route('/level<int:level_id>', methods=['GET', 'POST'])
def level(level_id):
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    if request.method == 'POST':
        score_value = int(request.form['score'])
        new_score = Score(username=username, level=f"Level {level_id}", points=score_value)
        db.session.add(new_score)
        db.session.commit()
        flash(f"Level {level_id} completed! Score saved.")
        return redirect(url_for('dashboard'))

    return render_template(f'level{level_id}.html', level_id=level_id)

# ---------------- ABOUT ---------------- #
@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
