
from distutils.log import debug
from multiprocessing import Event
from config import ApplicationConfig
from flask import Flask, jsonify, request, abort, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_restful.utils import cors
from flask_marshmallow import Marshmallow 
from uuid import uuid4
from flask_session import Session
from flask_cors import CORS, cross_origin
import datetime
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager




app = Flask(__name__)

app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
server_session = Session(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)


api = Api(app)


#api.decorators=[cors.crossdomain(origin='*')]



def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    name = db.Column(db.String())
    lastName = db.Column(db.String())
    events = db.relationship('Events', backref='user')

class Events(db.Model):
    id = db.Column(db.Integer(), primary_key=True, unique=True)
    nombre = db.Column(db.String())
    lugar = db.Column(db.String())
    direccion = db.Column(db.String())
    fecha_inicio = db.Column(db.DateTime())
    fecha_fin = db.Column(db.DateTime())
    categoria = db.Column(db.String())
    presencial = db.Column(db.Boolean)


    owner_id = db.Column(db.String(), db.ForeignKey('user.id'))


class EventsSchema(ma.Schema):
    class Meta:
        fields = ('id','nombre', 'lugar', 'direccion', 'fecha_inicio', 'fecha_fin', 'presencial', 'categoria', 'owner_id')

class UserSchema(ma.Schema):
    events = ma.Nested(EventsSchema, many=True)
    class Meta:
        model = User
        fields = ("id", "email", "password", "events", "name", "lastName")

class TokenSchema(ma.Schema):
    class Meta:
        fields = ("access_token", "msg")




class CreateUserResource(Resource):

    def post(self):
        email = request.json['email']
        password = request.json['password']
        name = request.json['name']
        lastName = request.json['lastName']
        user_exists = User.query.filter_by(email=email).first() is not None
        if user_exists:
            abort(409)
        new_user = User(email=email, password=password, name=name, lastName=lastName)
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user.id)

        response = {"access_token":access_token, "msg": 200}

        return acces_token_schema.dump(response)



class LoginUserResource(Resource):

    def post(self):
        email = request.json['email']
        password = request.json['password']

        user = User.query.filter_by(email=email).first()

        if user is None or password != user.password:
            return "Unauthorazied", 409

        access_token = create_access_token(identity=user.id)
        
        #session['user_id'] = user.id

        response = {"access_token":access_token, "msg": 200}

        return acces_token_schema.dump(response)


class LogOutResource(Resource):
    @jwt_required()
    def post(self):
        response = jsonify({"msg": "logout successful"})
        unset_jwt_cookies(response)
        return "logout successful", "200"



class UserInfoResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        return post_schema.dump(user)

class EventResource(Resource):
    @jwt_required()
    def post(self, offset):
            user_id = get_jwt_identity()
            if not user_id:
                return 'Unautorized', 409
            user = User.query.get_or_404(user_id)
            nombre = request.json['nombre']
            lugar = request.json['lugar']
            direccion = request.json['direccion']
            categoria = request.json['categoria']
            fecha_inicio = datetime.datetime.strptime(request.json['fecha_inicio'], '%Y-%m-%d')
            fecha_fin = datetime.datetime.strptime(request.json['fecha_fin'], '%Y-%m-%d')
            presencial = request.json['presencial']
            newEvent = Events(nombre = nombre, lugar=lugar, direccion=direccion, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin, presencial=presencial, categoria=categoria, owner_id = user.id)

            db.session.add(newEvent)
            db.session.commit()
            return event_schema.dump(newEvent)

    @jwt_required()
    def get(self, offset):
        user_id = get_jwt_identity()
        if not user_id:
            return 'Unautorized', 409
        user = User.query.get_or_404(user_id)
        events = Events.query.order_by(Events.id.desc()).filter_by(owner_id=user_id).offset(8*offset).limit(8).all() #.order_by(Events.fecha_inicio)
        return events_schema.dump(events)


class OneEventResource(Resource):
    @jwt_required()
    def put(self, id_event):

        event = Events.query.get_or_404(id_event)

        if 'nombre' in request.json:
            event.nombre = request.json['nombre']
        if 'lugar' in request.json:
            event.lugar = request.json['lugar']
        if 'direccion' in request.json:
            event.direccion = request.json['direccion']
        if 'fecha_inicio' in request.json:
            print('fecha_inicio')
            print(request.json['fecha_inicio'])
            event.fecha_inicio = datetime.datetime.strptime(request.json['fecha_inicio'], '%Y-%m-%d')
        if 'fecha_fin' in request.json:
            event.fecha_fin = datetime.datetime.strptime(request.json['fecha_fin'], '%Y-%m-%d')
        if 'presencial' in request.json:
            if request.json['presencial']=='true':
                event.presencial= True
            elif request.json['presencial']=='false':
                event.presencial = False
            else:
                event.presencial = request.json['presencial']
        if 'categoria' in request.json:
            event.categoria = request.json['categoria']

        db.session.commit()

        return event_schema.dump(event)
            
    @jwt_required() 
    def get(self, id_event):
        event = Events.query.get_or_404(id_event)
        return event_schema.dump(event)
    @jwt_required()
    def delete(self, id_event):
        event = Events.query.get_or_404(id_event)
        db.session.delete(event)
        db.session.commit()
        return '', 204
        



api.add_resource(UserInfoResource, '/@me')
api.add_resource(CreateUserResource, '/registro')
api.add_resource(LoginUserResource, '/login')
api.add_resource(LogOutResource, '/logout')
api.add_resource(EventResource, '/events/<int:offset>')
api.add_resource(OneEventResource, '/event/<string:id_event>')



post_schema = UserSchema()

acces_token_schema = TokenSchema()

events_schema = EventsSchema(many=True)
event_schema = EventsSchema()

if __name__ == "__main__":
    app.run(debug=True)