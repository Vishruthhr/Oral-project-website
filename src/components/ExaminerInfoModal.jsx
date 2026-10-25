import React, { useState, useEffect } from 'react';
import { useDental } from '../context/DentalContext';

export default function ExaminerInfoModal({ examinerId, isOpen, onClose }) {
  const { getExaminerDetails, records } = useDental();
  const [examiner, setExaminer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !examinerId) {
      setExaminer(null);
      return;
    }
    let isMounted = true;
    setLoading(true);
    if (getExaminerDetails) {
      getExaminerDetails(examinerId).then(data => {
        if (isMounted) {
          setExaminer(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [isOpen, examinerId, getExaminerDetails]);

  if (!isOpen || !examinerId) return null;

  // Calculate total patient surveys conducted by this examiner ID
  const surveyCount = (records || []).filter(
    r => String(r.examinerId || '').trim().toUpperCase() === String(examinerId).trim().toUpperCase()
  ).length;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="examiner-info-card" onClick={e => e.stopPropagation()}>
        <div className="examiner-info-header">
          <h3>Examiner Profile Details</h3>
          <button type="button" className="btn-modal-close" onClick={onClose} title="Close">✕</button>
        </div>

        {loading ? (
          <div className="examiner-info-loading">
            <div className="spinner-mini"></div>
            <span>Retrieving examiner profile for <b>{examinerId}</b>...</span>
          </div>
        ) : (
          <div className="examiner-info-body">
            <div className="examiner-profile-top">
              <div className="examiner-avatar-box">
                {examiner?.photoUrl ? (
                  <img src={examiner.photoUrl} alt={examiner.examinerName || examinerId} className="examiner-full-avatar" />
                ) : (
                  <div className="examiner-avatar-fallback">
                    <span>👤</span>
                  </div>
                )}
              </div>

              <div className="examiner-title-area">
                <h4 className="examiner-display-name">
                  {examiner?.examinerName || `Examiner ${examinerId}`}
                </h4>
                <div className="examiner-id-tag">
                  ID: <b>{examinerId}</b>
                </div>
              </div>
            </div>

            <div className="examiner-details-grid">
              <div className="examiner-detail-item">
                <span className="detail-label">Mobile Number</span>
                <span className="detail-value">
                  {examiner?.mobileNumber ? (
                    <a href={`tel:${examiner.mobileNumber}`} className="examiner-link">
                      📞 {examiner.mobileNumber}
                    </a>
                  ) : (
                    <span className="text-muted">Not registered</span>
                  )}
                </span>
              </div>

              <div className="examiner-detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">
                  {examiner?.email ? (
                    <a href={`mailto:${examiner.email}`} className="examiner-link">
                      ✉️ {examiner.email}
                    </a>
                  ) : (
                    <span className="text-muted">Not registered</span>
                  )}
                </span>
              </div>

              <div className="examiner-detail-item">
                <span className="detail-label">Clinical Surveys Conducted</span>
                <span className="detail-value highlight-num">
                  📋 {surveyCount} Patient Survey(s)
                </span>
              </div>

              {examiner?.createdAt && (
                <div className="examiner-detail-item">
                  <span className="detail-label">Registration Date</span>
                  <span className="detail-value">
                    🗓️ {new Date(examiner.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="examiner-info-actions">
              <button type="button" className="btn teal btn-close-profile" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
