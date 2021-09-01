// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import { Alert, Button } from './widgets';

const history = createHashHistory();

// -- SHARED DATA -- //
let shared = sharedComponentData({ students: [], courses: [] });

// -- COMPONENTS -- //
class Navbar extends Component<{ brand: React.Node, children?: React.Node }> {
    render() {
        return (
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <NavLink className='navbar-brand' exact to='/'>
                    {' '}
                    {this.props.brand}{' '}
                </NavLink>

                <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                    <ul className='navbar-nav mr-auto'>
                        {this.props.children.map((child, i) => (
                            <li className='nav-link' key={i}>
                                {child}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        );
    }
}

class Card extends Component<{ title: React.Node, subtitle?: React.node, children?: React.Node }> {
    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{this.props.title}</h4>
                    <h6 className='card-subtitle mb-3 ml-4 mt-n2 text-muted'>{this.props.subtitle}</h6>
                    <div className='card-text'>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

class ListGroup extends Component<{ children: React.Node }> {
    render() {
        return (
            <ul className='list-group'>
                {this.props.children.map((child, i) => (
                    <li className='list-group-item' key={i}>
                        {child}
                    </li>
                ))}
            </ul>
        );
    }
}

class Menu extends Component {
    render() {
        return (
            <Navbar brand='React Example'>
                <NavLink className='nav-link' to='/students'>
                    Students
                </NavLink>
                <NavLink className='nav-link' to='/courses'>
                    Courses
                </NavLink>
            </Navbar>
        );
    }
}

class Home extends Component {
    render() {
        return <Card title='React example with static pages'></Card>;
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

let olaJensen = new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no');
let kariLarsen = new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no');
let vetleHarnes = new Student('Vetle', 'Harnes', 'vetle.harnes@ntnu.no');

shared.students = [olaJensen, kariLarsen, vetleHarnes];

// -- COURSE -- //
class Course {
    id: number;
    static nextId = 1;

    code: string;
    title: string;
    students: [];

    constructor(code: string, title: string) {
        this.id = Course.nextId++;
        this.code = code;
        this.title = title;
        this.students = [];
    }

    addStudent(student) {
        this.students.push(student);
    }

    deleteStudent(student) {
        this.students = this.students.filter(e => e != student);
    }
}

let TDAT2001 = new Course('TDAT2001', 'Realfag for dataingeniører');
let TDAT2002 = new Course('TDAT2002', 'Matematikk 2');
let TDAT2003 = new Course('TDAT2003', 'Systemutvikling 2');
let TDAT2005 = new Course('TDAT2005', 'Algoritmer og datastrukturer');

TDAT2001.addStudent(olaJensen);
TDAT2001.addStudent(vetleHarnes);
TDAT2001.addStudent(kariLarsen);

TDAT2002.addStudent(vetleHarnes);

TDAT2003.addStudent(olaJensen);
TDAT2003.addStudent(vetleHarnes);

TDAT2005.addStudent(kariLarsen);

shared.courses = [TDAT2001, TDAT2002, TDAT2003, TDAT2005];

// -- DISPLAYS THE STUDENT INFO -- //
class StudentList extends Component {
    render() {
        return (
            <Card title='Students' subtitle=<NavLink to={'/students/' + Student.nextId + '/add'}>Add student </NavLink>>
                <ListGroup>
                    {shared.students.map(student => (
                        <div key={student.id}>
                            <NavLink to={'/students/' + student.id}>
                                {student.firstName} {student.lastName}
                            </NavLink>
                            <NavLink to={'/students/' + student.id + '/edit'}> edit</NavLink>
                        </div>
                    ))}
                </ListGroup>
            </Card>
        );
    }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
    render() {
        let student = shared.students.find(student => student.id == this.props.match.params.id);
        if (!student) {
            console.error('Student not found'); // Until we have a warning/error system (next week)
            return null; // Return empty object (nothing to render)
        }

        return (
            <Card title='Details'>
                <ListGroup>
                    <span key={student.firstName}>First name: {student.firstName}</span>
                    <span key={student.lastName}>Last name: {student.lastName}</span>
                    <span key={student.email}>Email: {student.email}</span>
                    <span>
                        {' '}
                        <Card title='Courses'>
                            <ListGroup>
                                {shared.courses
                                    .filter(course => course.students.filter(e => e == student).length == 1)
                                    .map(course => (
                                        <span key={course.code}>
                                            {course.code} {course.title}
                                        </span>
                                    ))}
                            </ListGroup>
                        </Card>{' '}
                    </span>
                </ListGroup>
            </Card>
        );
    }
}

class StudentEdit extends Component<{ match: { params: { id: number } } }> {
    render() {
        let student = shared.students.find(student => student.id == this.props.match.params.id);
        if (!student) {
            console.error('Student not found'); // Until we have a warning/error system (next week)
            return null; // Return empty object (nothing to render)
        }

        return (
            <Card
                title='Edit student'
                subtitle=<NavLink to={'/students'} onClick={() => this.removeStudent(student)}>
                    Remove student{' '}
                </NavLink>
            >
                <ListGroup>
                    <div key={0}>
                        First name:{' '}
                        <input
                            type='text'
                            value={student.firstName}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (student.firstName = event.target.value)}
                        />
                    </div>
                    <div key={1}>
                        Last name:{' '}
                        <input
                            type='text'
                            value={student.lastName}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (student.lastName = event.target.value)}
                        />
                    </div>
                    <div key={2}>
                        Email:{' '}
                        <input
                            type='text'
                            value={student.email}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (student.email = event.target.value)}
                        />
                    </div>
                    <span>
                        {' '}
                        <Card title='Courses'>
                            <ListGroup>
                                {shared.courses
                                    .filter(course => course.students.filter(e => e == student).length == 1)
                                    .map(course => (
                                        <div key={course.code}>
                                            <span>
                                                {course.code} {course.title}{' '}
                                            </span>
                                            <NavLink to={'/students/' + student.id + '/edit'} onClick={() => course.deleteStudent(student)}>
                                                remove{' '}
                                            </NavLink>
                                        </div>
                                    ))}
                            </ListGroup>
                            <ListGroup>
                                {shared.courses
                                    .filter(course => course.students.filter(e => e == student).length == 0)
                                    .map(course => (
                                        <div key={course.code}>
                                            <span>
                                                {course.code} {course.title}{' '}
                                            </span>
                                            <NavLink to={'/students/' + student.id + '/edit'} onClick={() => course.addStudent(student)}>
                                                add{' '}
                                            </NavLink>
                                        </div>
                                    ))}
                            </ListGroup>
                        </Card>{' '}
                    </span>
                </ListGroup>
            </Card>
        );
    }

    removeStudent(student) {
        shared.students = shared.students.filter(e => e != student);
        alert('Student ' + student.firstName + ' ' + student.lastName + ' was removed!');
    }
}

class StudentAdd extends Component<{ match: { params: { id: number } } }> {
    firstName = '';
    lastName = '';
    email = '';

    form = null;

    render() {
        return (
            <Card title='Add student'>
                <form ref={e => (this.form = e)}>
                    <ListGroup>
                        <div key={0}>
                            First name:{' '}
                            <input
                                type='text'
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
                                required
                            />
                        </div>
                        <div key={1}>
                            Last name:{' '}
                            <input
                                type='text'
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
                                required
                            />
                        </div>
                        <div key={2}>
                            Email:{' '}
                            <input
                                type='text'
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
                                required
                            />
                        </div>

                        <Button.Dark onClick={this.addStudent}>
                            Add student
                        </Button.Dark>
                    </ListGroup>
                </form>
            </Card>
        );
    }

    addStudent() {
        if (!this.form || !this.form.checkValidity()) {
            alert('Please fill out all the fields in the form!');
            return;
        }

        let student = new Student(this.firstName, this.lastName, this.email);
        shared.students.push(student);

        alert('Student ' + student.firstName + ' ' + student.lastName + ' added!');
        history.push('/students');
    }
}

// -- DISPLAYS THE COURSE INFO -- //
class CourseList extends Component {
    render() {
        return (
            <Card title='Courses' subtitle=<NavLink to={'/courses/' + Course.nextId + '/add'}>Add course </NavLink>>
                <ListGroup>
                    {shared.courses.map(course => (
                        <div key={course.code}>
                            <NavLink to={'/courses/' + course.id}>
                                {course.code} {course.title}
                            </NavLink>
                            <NavLink to={'/courses/' + course.id + '/edit'}> edit</NavLink>
                        </div>
                    ))}
                </ListGroup>
            </Card>
        );
    }
}

class CourseDetails extends Component<{ match: { params: { id: number } } }> {
    render() {
        let course = shared.courses.find(course => course.id == this.props.match.params.id);
        if (!course) {
            console.error('Course not found!');
            return null;
        }

        return (
            <Card title='Details'>
                <ListGroup>
                    <span>Code: {course.code}</span>
                    <span>Title: {course.title}</span>
                    <span>
                        {' '}
                        <Card title='Students'>
                            <ListGroup>
                                {course.students.map(student => (
                                    <span key={student.id}>
                                        {student.firstName} {student.lastName}
                                    </span>
                                ))}
                            </ListGroup>
                        </Card>{' '}
                    </span>
                </ListGroup>
            </Card>
        );
    }
}

class CourseEdit extends Component<{ match: { params: { id: number } } }> {
    render() {
        let course = shared.courses.find(course => course.id == this.props.match.params.id);
        if (!course) {
            console.error('Course not found!');
            return null;
        }

        return (
            <Card
                title='Edit course'
                subtitle=<NavLink to={'/courses'} onClick={() => this.removeCourse(course)}>
                    Remove course{' '}
                </NavLink>
            >
                <ListGroup>
                    <div key={0}>
                        Code:{' '}
                        <input
                            type='text'
                            value={course.code}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (course.code = event.target.value)}
                        />
                    </div>
                    <div key={1}>
                        Title:{' '}
                        <input
                            type='text'
                            value={course.title}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (course.title = event.target.value)}
                        />
                    </div>
                    <span>
                        {' '}
                        <Card title='Students'>
                            <ListGroup>
                                {course.students.map(student => (
                                    <div key={student.id}>
                                        <span>
                                            {student.firstName} {student.lastName}{' '}
                                        </span>
                                        <NavLink to={'/courses/' + course.id + '/edit'} onClick={() => course.deleteStudent(student)}>
                                            remove{' '}
                                        </NavLink>
                                    </div>
                                ))}
                            </ListGroup>
                            <ListGroup>
                                {shared.students
                                    .filter(student => !course.students.includes(student))
                                    .map(student => (
                                        <div key={student.id}>
                                            <span>
                                                {student.firstName} {student.lastName}{' '}
                                            </span>
                                            <NavLink to={'/courses/' + course.id + '/edit'} onClick={() => course.addStudent(student)}>
                                                add{' '}
                                            </NavLink>
                                        </div>
                                    ))}
                            </ListGroup>
                        </Card>{' '}
                    </span>
                </ListGroup>
            </Card>
        );
    }

    removeCourse(course) {
        shared.courses = shared.courses.filter(e => e != course);
        alert('Course ' + course.code + ' ' + course.title + ' was removed!');
    }
}

class CourseAdd extends Component {
    code = '';
    title = '';

    form = null;

    render() {
        return (
            <Card title='Details'>
                <form ref={e => (this.form = e)}>
                    <ListGroup>
                        <div key={0}>
                            Code:{' '}
                            <input
                                type='text'
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.code = event.target.value)}
                                required
                            />
                        </div>
                        <div key={1}>
                            Title:{' '}
                            <input
                                type='text'
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
                                required
                            />
                        </div>
                        <Button.Dark onClick={this.addCourse}>
                            Add course
                        </Button.Dark>
                    </ListGroup>
                </form>
            </Card>
        );
    }

    addCourse() {
        if (!this.form || !this.form.checkValidity()) {
            alert('Please fill out all the fields in the form!');
            return;
        }

        let course = new Course(this.code, this.title);
        shared.courses.push(course);

        alert('Course ' + course.code + ' ' + course.title + ' added!');
        history.push('/courses');
    }
}

// -- ROUTING -- //
const root = document.getElementById('root');
if (root)
    ReactDOM.render(
        <HashRouter>
            <div>
                <Menu />
                <Route exact path='/' component={Home} />
                <Route path='/students' component={StudentList} />
                <Route exact path='/students/:id' component={StudentDetails} />
                <Route exact path='/students/:id/edit' component={StudentEdit} />
                <Route exact path='/students/:id/add' component={StudentAdd} />
                <Route path='/courses' component={CourseList} />
                <Route exact path='/courses/:id' component={CourseDetails} />
                <Route exact path='/courses/:id/edit' component={CourseEdit} />
                <Route exact path='/courses/:id/add' component={CourseAdd} />
            </div>
        </HashRouter>,
        root
    );
