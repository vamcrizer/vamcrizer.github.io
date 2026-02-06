class SinhVien {
    constructor(maSV, hoTen, ngaySinh, lopHoc, diemGPA) {
        this.maSV = maSV;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.lopHoc = lopHoc;
        this.diemGPA = diemGPA;
    }

    capNhatThongTin(hoTen, ngaySinh, lopHoc, diemGPA) {
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.lopHoc = lopHoc;
        this.diemGPA = diemGPA;
    }

    formatNgaySinh() {
        const date = new Date(this.ngaySinh);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

class QuanLySinhVien {
    constructor() {
        this.danhSach = [];
        this.editingIndex = -1;
        this.init();
    }

    init() {
        this.form = document.getElementById('studentForm');
        this.tableBody = document.getElementById('studentTableBody');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.cancelEdit());

        this.loadFromStorage();
        this.renderTable();
    }

    handleSubmit(e) {
        e.preventDefault();

        const maSV = document.getElementById('maSV').value.trim();
        const hoTen = document.getElementById('hoTen').value.trim();
        const ngaySinh = document.getElementById('ngaySinh').value;
        const lopHoc = document.getElementById('lopHoc').value.trim();
        const diemGPA = parseFloat(document.getElementById('diemGPA').value);

        if (this.editingIndex === -1) {
            if (this.kiemTraMaSV(maSV)) {
                alert('Ma sinh vien da ton tai!');
                return;
            }
            const sinhVien = new SinhVien(maSV, hoTen, ngaySinh, lopHoc, diemGPA);
            this.danhSach.push(sinhVien);
        } else {
            this.danhSach[this.editingIndex].capNhatThongTin(hoTen, ngaySinh, lopHoc, diemGPA);
            this.editingIndex = -1;
            this.submitBtn.textContent = 'Them Sinh Vien';
            this.cancelBtn.classList.add('hidden');
            document.getElementById('maSV').disabled = false;
        }

        this.saveToStorage();
        this.renderTable();
        this.form.reset();
    }

    kiemTraMaSV(maSV) {
        return this.danhSach.some(sv => sv.maSV === maSV);
    }

    xoaSinhVien(index) {
        if (confirm('Ban co chac chan muon xoa sinh vien nay?')) {
            this.danhSach.splice(index, 1);
            this.saveToStorage();
            this.renderTable();
        }
    }

    suaSinhVien(index) {
        const sv = this.danhSach[index];
        document.getElementById('maSV').value = sv.maSV;
        document.getElementById('hoTen').value = sv.hoTen;
        document.getElementById('ngaySinh').value = sv.ngaySinh;
        document.getElementById('lopHoc').value = sv.lopHoc;
        document.getElementById('diemGPA').value = sv.diemGPA;

        document.getElementById('maSV').disabled = true;
        this.editingIndex = index;
        this.submitBtn.textContent = 'Cap Nhat';
        this.cancelBtn.classList.remove('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelEdit() {
        this.editingIndex = -1;
        this.submitBtn.textContent = 'Them Sinh Vien';
        this.cancelBtn.classList.add('hidden');
        document.getElementById('maSV').disabled = false;
        this.form.reset();
    }

    renderTable() {
        this.tableBody.innerHTML = '';

        if (this.danhSach.length === 0) {
            this.emptyMessage.style.display = 'block';
            return;
        }

        this.emptyMessage.style.display = 'none';

        this.danhSach.forEach((sv, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sv.maSV}</td>
                <td>${sv.hoTen}</td>
                <td>${sv.formatNgaySinh()}</td>
                <td>${sv.lopHoc}</td>
                <td>${sv.diemGPA.toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="quanLy.suaSinhVien(${index})">Sua</button>
                    <button class="action-btn delete-btn" onclick="quanLy.xoaSinhVien(${index})">Xoa</button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    saveToStorage() {
        localStorage.setItem('danhSachSinhVien', JSON.stringify(this.danhSach));
    }

    loadFromStorage() {
        const data = localStorage.getItem('danhSachSinhVien');
        if (data) {
            const parsed = JSON.parse(data);
            this.danhSach = parsed.map(sv =>
                new SinhVien(sv.maSV, sv.hoTen, sv.ngaySinh, sv.lopHoc, sv.diemGPA)
            );
        }
    }
}

const quanLy = new QuanLySinhVien();
