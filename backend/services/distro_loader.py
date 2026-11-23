from models import Distribution


def load_distros_from_db():
    distros = Distribution.query.all()
    return [
        {
            column.key: getattr(distro, column.key)
            for column in Distribution.__table__.columns
        }
        for distro in distros
    ]
