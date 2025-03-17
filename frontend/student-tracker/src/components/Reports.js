import React from 'react';

function Reports() {
    return (
        <div className="report-container">
            <h3 className="text-center mb-4">Reports</h3>
            <div className="mb-3">
                <label className="form-label">Term</label>
                <select className="form-select">
                    <option value="fall-2024">Fall 2024</option>
                    <option value="winter-2025">Winter 2025</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select">
                    <option value="all">All</option>
                    <option value="at-risk">At Risk</option>
                    <option value="on-track">On Track</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Date Range</label>
                <div className="row">
                    <div className="col">
                        <input type="date" className="form-control" />
                    </div>
                    <div className="col">
                        <input type="date" className="form-control" />
                    </div>
                </div>
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    <h5>Summary</h5>
                    <p>% At Risk: 10%</p>
                    <p>Avg Attendance: 85%</p>
                    <p>Avg Grade: 75.5</p>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-custom mx-2">Download CSV</button>
                <button className="btn btn-custom mx-2">Download PDF</button>
            </div>
        </div>
    );
}

export default Reports;