var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const start = Date.now()
const g = 9.8
const x0 = canvas.width / 2
const y0 = 50
const scale = 50

var pendulums = []

function get_t(zero = start) {
    return (Date.now() - zero) / 1000
}

class Pendulum {
    constructor(a = 1, k = 0, f = 0, y = 0, height = 0, n = 0, color = 'black', width = 1) {
        this.t = Date.now()
        this.f = f
        this.a = a
        this.k = k
        this.w = Math.sqrt(k / (a * 4))
        this.y = y
        this.n = n
        this.height = height
        this.color = color
        this.width = width
    }

    get_x(t) {
        return this.a * Math.sin(this.w * t + this.f)
    }

    async render() {
        let t = get_t(this.t)
        let x = this.get_x(t)
        // console.log(t, x, y)
        ctx.fillRect(x * scale + x0, y0 + this.y, this.height, this.height)
        ctx.beginPath()
        let l = (x * scale + x0) / this.n
        for (let i = 0; i < this.n; ++i) {
            ctx.moveTo(l * i, y0 + this.y + this.height * (i % 2))
            ctx.lineTo(l * (i + 1), y0 + this.y + this.height * (!(i % 2)))
            ctx.stroke()
        }
    }

    static drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        pendulums.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.width
            p.render()
        })
    }

    static clear() {
        pendulums = []
    }

    static create(amplitude = 0, spring_strength_k = 0, initial_state = 0, y_position = 0, spring_height = 100, spring_sections_n = 10, color = 'black', width = 1) {
        pendulums.push(new Pendulum(amplitude, spring_strength_k, initial_state, y_position, spring_height, spring_sections_n, color, width))
    }

    static create_seria(
        amplitude_a = 0, spring_strength_k = 0,
        initial_state_func = (i) => 0.1 * i,
        y_position_func = (i) => 100 * i,
        spring_height_func = () => 100,
        spring_sections_func = () => 10,
        color_func = () => 'black',
        width_func = (i) => i + 1) {
        for (let i = 0; i < 10; ++i)
            pendulums.push(new Pendulum(
                amplitude_a, spring_strength_k,
                initial_state_func(i), y_position_func(i), spring_height_func(i), spring_sections_func(i), color_func(i), width_func(i)))
    }
}

var interval = setInterval(() => Pendulum.drawAll(), 0);

Pendulum.create(5, 500)
Pendulum.create(5, 500, 10, 300)
Pendulum.create(1, 1000, 0, 600, 50, 50, 'red', 1)
