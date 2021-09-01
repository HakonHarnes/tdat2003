// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';

// -- COMPONENTS -- // 
class Navbar extends Component<{ brand: React.Node, children?: React.Node }> {
    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" exact to="/"> {this.props.brand} </NavLink>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {this.props.children.map((child, i) => 
                         <li className="nav-link" key={i}>
                            {child} 
                        </li>
                        )}
                    </ul>
                </div>
            </nav>
        );
    }
}

class Card extends Component<{ title: React.Node, children?: React.Node }> {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{this.props.title}</h4>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

class ListGroup extends Component<{ children: React.Node }> {
    render(){
        return (
            <ul className="list-group">
                {this.props.children.map((child, i) => 
                    <li className="list-group-item" key={i}>
                        {child}
                    </li>
                )}
            </ul>
        );
    }
}

class Menu extends Component {
  render() {
    return (
        <Navbar brand="React Example">
             <NavLink className="nav-link" to="/students">Students</NavLink>
             <NavLink className="nav-link" to="/courses">Courses</NavLink>
        </Navbar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="React example with static pages"></Card>;
  }
}

// -- STUDENT -- //
class Student {
  id: number;
  static nextId = 1;

  firstName: string;
  lastName: string;
  email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

let olaJensen   = new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'); 
let kariLarsen  = new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no');
let vetleHarnes = new Student('Vetle', 'Harnes', 'vetle.harnes@ntnu.no'); 

let students = [olaJensen, kariLarsen, vetleHarnes];

// -- COURSE -- // 
class Course {
    code: string; 
    title: string; 
    students: []; 

    constructor(code: string, title: string){
        this.code = code; 
        this.title = title; 
        this.students = []; 
    }

    addStudent(student){
        this.students.push(student); 
    }

    deleteStudent(student){
        this.students = this.students.filter(e => e != student);
    }
}

let TDAT2001 = new Course('TDAT2001', 'Realfag for dataingeniører');
let TDAT2002 = new Course('TDAT2002', 'Matematikk 2');
let TDAT2003 = new Course('TDAT2003', 'Systemutvikling 2');
let TDAT2005 = new Course('TDAT2005', 'Algoritmer og datastrukturer'); 

let courses = [TDAT2001, TDAT2002, TDAT2003, TDAT2005];

TDAT2001.addStudent(olaJensen);
TDAT2001.addStudent(vetleHarnes);
TDAT2001.addStudent(kariLarsen);

TDAT2002.addStudent(vetleHarnes); 

TDAT2003.addStudent(olaJensen);
TDAT2003.addStudent(vetleHarnes);

TDAT2005.addStudent(kariLarsen);

// -- DISPLAYS THE STUDENT INFO -- // 
class StudentList extends Component {
  render(){
        return (
            <Card title="Students">
                <ListGroup>
                {students.map(student => 
                <NavLink to={'/students/' + student.id} key={student.id}>
                    {student.firstName} {student.lastName}
                </NavLink>
                )}
                </ListGroup>
           </Card>
        )
    }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  render() {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student) {
      console.error('Student not found'); // Until we have a warning/error system (next week)
      return null; // Return empty object (nothing to render)
    }

    return (
      <Card title="Details">
            <ListGroup>
                <span key={student.firstName}>First name: {student.firstName}</span>
                <span key={student.lastName}>Last name: {student.lastName}</span>
                <span key={student.email}>Email: {student.email}</span>
                <span> <Card title="Courses">
                    <ListGroup>
                        {courses.filter(course => 
                            (course.students.filter(e => e == student).length) == 1)
                                .map(course => <span key={course.code}>{course.code} {course.title}</span>)}
                    </ListGroup>
                </Card> </span>
            </ListGroup>
       </Card>
    );
  }
}

// -- DISPLAYS THE COURSE INFO -- // 
class CourseList extends Component {
    render(){
        return (
            <Card title="Courses">
                <ListGroup>
                    {courses.map(course => (
                    <NavLink to={'/courses/' + course.code} key={course.code}>
                        {course.code} {course.title}
                    </NavLink>
                    ))}
                </ListGroup>
            </Card>
        )
    }
}

class CourseDetails extends Component<{ match: { params: { code: string} } }> {
    render(){
        let course = courses.find(course => course.code == this.props.match.params.code);
        if(!course){
            console.error('Course not found!');
            return null; 
        } 

        return (
            <Card title="Details">
                <ListGroup>
                    <span>Code: {course.code}</span>
                    <span>Title: {course.title}</span>
                    <span> <Card title="Students">
                        <ListGroup>
                           {course.students.map(student => <span key={student.id}>{student.firstName} {student.lastName}</span>)}
                        </ListGroup>
                    </Card> </span>
            </ListGroup>
       </Card>
    );
    }
}

// -- ROUTING -- // 
const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentList} />
        <Route path="/students/:id" component={StudentDetails} />
        <Route path="/courses" component={CourseList} />
        <Route path="/courses/:code" component={CourseDetails} />
      </div>
    </HashRouter>,
    root
  );